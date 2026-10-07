// ==UserScript==
// @name         ChatGPT 中键打开新窗口
// @namespace    https://chatgpt.com/
// @version      2.0
// @description  中键点击“新聊天”或“ChatGPT”打开独立窗口；中键点击侧栏项目标题，在独立窗口打开该项目的新对话。
// @match        https://chatgpt.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// ==/UserScript==

(() => {
    'use strict';

    const normalize = value => (value || '').replace(/\s+/g, ' ').trim();

    function getProjectNewChatUrl(node) {
        if (!(node instanceof Element)) return null;

        // 项目标题不是链接：项目 ID 在标题行图标内，文字与图标是兄弟节点。
        const markerSelector = '[data-sidebar-project-container-id]';
        const rowSelector = 'div.flex.min-w-0.flex-1.items-center';
        let marker = node.closest(markerSelector);
        if (!marker) {
            for (let row = node.closest(rowSelector); row; row = row.parentElement?.closest(rowSelector)) {
                const candidate = row.querySelector(markerSelector);
                // 要求图标与点击位置属于同一标题行，避免把整个侧栏当成项目标题。
                if (candidate?.closest(rowSelector) !== row) continue;
                const control = node.closest('button, [role="button"], a');
                if (control && row.contains(control)) return null;
                marker = candidate;
                break;
            }
        }
        if (marker) {
            const match = marker.getAttribute('data-sidebar-project-container-id')
                .match(/^project:(g-p-[a-f0-9]+)$/i);
            if (match) return `${location.origin}/g/${match[1]}/project`;
        }

        // 只处理侧栏项目标题，不拦截正文链接、已有对话或项目菜单按钮。
        if (!node.closest('aside, nav, #stage-sidebar, #stage-slideover-sidebar, [data-testid="sidebar"]')) {
            return null;
        }
        const link = node.closest('a[href]');
        if (!link || node.closest('button, [role="button"]')) return null;

        const url = new URL(link.getAttribute('href'), location.href);
        if (url.origin !== location.origin) return null;
        const match = url.pathname.match(/^\/g\/(g-p-[^/]+)(?:\/project)?\/?$/);
        if (!match) return null;

        // 与侧栏该项目的“新建对话”按钮使用相同地址。
        return `${url.origin}/g/${match[1]}/project`;
    }

    function isTarget(node) {
        if (!(node instanceof Element)) return false;

        const control = node.closest('a, button, [role="button"], [role="link"]');
        if (!control) return false;

        const labels = [
            control.textContent,
            control.getAttribute('aria-label'),
            control.getAttribute('title'),
            control.getAttribute('data-testid'),
        ].map(normalize);

        if (labels.some(label => /^(新聊天|新对话|New chat)(?:\s|$)/i.test(label)) ||
            labels.includes('create-new-chat-button')) {
            return true;
        }

        // 限定在页面左上区域，避免匹配正文里的 ChatGPT 链接。
        const rect = control.getBoundingClientRect();
        const isTopLeft = rect.top >= 0 && rect.top < 160 &&
            rect.left >= 0 && rect.left < Math.min(600, innerWidth / 2);
        return isTopLeft && labels.some(label => /^ChatGPT(?:\s|$)/i.test(label));
    }

    // 阻止中键默认导航和自动滚动；事件委托适用于页面动态更新。
    window.addEventListener('mousedown', event => {
        if (event.button !== 1 || (!getProjectNewChatUrl(event.target) && !isTarget(event.target))) return;
        event.preventDefault();
        event.stopImmediatePropagation();
    }, true);

    window.addEventListener('auxclick', event => {
        if (event.button !== 1) return;
        const projectUrl = getProjectNewChatUrl(event.target);
        if (!projectUrl && !isTarget(event.target)) return;
        event.preventDefault();
        event.stopImmediatePropagation();

        // 指定窗口尺寸，让浏览器以独立窗口打开；每次点击创建新窗口。
        window.open(
            projectUrl || 'https://chatgpt.com/',
            '_blank',
            'popup=yes,width=1100,height=800,resizable=yes,scrollbars=yes,noopener,noreferrer'
        );
    }, true);
})();
