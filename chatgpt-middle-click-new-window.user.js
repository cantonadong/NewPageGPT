// ==UserScript==
// @name         ChatGPT 中键打开新窗口
// @namespace    https://chatgpt.com/
// @version      1.0.0
// @description  中键点击“新聊天”或左上角“ChatGPT”，在独立窗口打开 ChatGPT 首页。
// @match        https://chatgpt.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// ==/UserScript==

(() => {
    'use strict';

    const normalize = value => (value || '').replace(/\s+/g, ' ').trim();

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
        if (event.button !== 1 || !isTarget(event.target)) return;
        event.preventDefault();
        event.stopImmediatePropagation();
    }, true);

    window.addEventListener('auxclick', event => {
        if (event.button !== 1 || !isTarget(event.target)) return;
        event.preventDefault();
        event.stopImmediatePropagation();

        // 指定窗口尺寸，让浏览器以独立窗口打开；每次点击创建新窗口。
        window.open(
            'https://chatgpt.com/',
            '_blank',
            'popup=yes,width=1100,height=800,resizable=yes,scrollbars=yes,noopener,noreferrer'
        );
    }, true);
})();
