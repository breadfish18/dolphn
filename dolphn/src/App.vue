<template>
    <div id="app">
        <Chat />
    </div>
</template>

<script>
import Chat from './components/Chat.vue';

export default {
    name: 'App',
    components: {
        Chat
    },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@100;300;400;500;700;900&display=swap");

html {
    overflow: hidden;
    font-family: Noto Sans TC, sans-serif;
}

*,
*::before,
*::after {
    margin: 0;
    padding: 0;
    color: #ffffff;
    box-sizing: inherit;
}

img {
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -o-user-select: none;
    user-select: none;
}

a {
    color: #18a0fb;
}

/* ----panels---- */

.right-panel {
    width: 247px;
    background: #31394d;
}

.server-panel {
    background: #293040;
    overflow-y: scroll;
    scrollbar-width: none;
    display: flex;
    flex-direction: column;
    width: 72px;
}

.left-panel {
    width: 266px;
    background: #31394d;
    overflow-y: none;
    scrollbar-width: none;
}

.divider {
    width: 252px;
    margin-top: 7.5px;
    margin-left: 7px;
    height: 1px;
    background: #707070;
}

.area-divider {
    width: calc(100vw - 247px - 266px - 32px - 64px);
    margin-left: 16px;
    border: 1px solid #0c0f1d;
}

.server-card {
    height: 48px;
    width: 266px;
    background: #31394d;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.25);
    clip-path: inset(-5px -5px -5px 0px);
    border-radius: 12px 0px 0px 0px;
    line-height: 48px;
    transform-style: preserve-3d;
    /* display: inline-block; */
}
.server-card::after {
    content: "";
    background-color: #293040;
    width: 266px;
    height: 48px;
    position: absolute;
    top: 0;
    transform: translateZ(-1px);
}

.server-name {
    font-size: 16px;
    font-weight: bold;
    margin-left: 20px;
}

.center-panel {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    background: #3a4259;
}

.wrap {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 100%;
}

.name-input::placeholder {
    color: #cbcbcb40;
}

.desc-input {
    width: 368px;
    height: 72px;
    line-height: 36px;
    background: #040509;
    border: 0px;
    border-radius: 8px;
    color: white;
    font: 300 16px Noto Sans TC;
    outline: none;
    resize: none;
    padding-left: 12px;
    padding-top: 8px;
    margin-left: 20px;
}

.desc-input::placeholder {
    color: #cbcbcb40;
}

.new-descriptor {
    margin-left: 20px;
    margin-bottom: 3px;
    font: normal 12px Noto Sans TC;
}

.title {
    margin-left: 20px;
    font: bold 16px Noto Sans TC;
    margin-top: 11px;
    margin-bottom: 10px;
}

div.new-descriptor:nth-child(1) {
    margin-top: 10px;
}

/* ----friends---- */
.friends {
    display: flex;
    margin-top: 18.5px;
    margin-left: 21px;
    flex-wrap: wrap;
}

.friend {
    text-align: center;
    margin-right: 19px;
    margin-top: 19px;
    font: 300 10px Noto Sans TC;
}

.friend h3 {
    margin-top: 3.3px;
    max-width: 64.08px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.friend p {
    margin-right: 12px;
    margin-left: 12px;
}

.friends-name {
    margin-top: 12px;
    margin-left: 12px;
    text-align: left;
    color: #c4c4c4;
    font: Bold 12px Noto Sans TC;
    text-transform: uppercase;
    display: inline-block;
}

/* ----channels---- */

.channel-bar {
    background: #3a4259;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.25);
    clip-path: inset(-5px 0px -5px 0px);

    height: 48px;
    line-height: 48px;
    padding-left: 20px;
    position: relative;
}

.channels {
    margin-top: 2px;
}

.channel {
    font: 300 12px Noto Sans TC;
    height: 38px;
    width: 266px;
    line-height: 38px;
    cursor: pointer;
}

.channel h3 {
    margin-left: 12px;
    position: relative;
}

.channel h3[unread]::after {
    content: attr(unread);
    font-size: smaller;
    position: absolute;
    background: #1787ff;
    border-radius: 50%;
    height: 18px;
    width: 18px;
    right: 10px;
    line-height: 18px;
    text-align: center;
    top: calc(38px / 2 - (18px / 2));
}

.channel:hover {
    /* background: #31374b; */
    text-decoration: underline;
}

.channel.selected:hover {
    text-decoration: none;
    cursor: pointer;
}

.channel-div {
    display: none;
}

.server p {
    margin-left: 12px;
    margin-right: 12px;
}

.server {
    margin-top: 12px;
}
.server-self {
    position: absolute;
    bottom: 12px;
    left: 12px;
}
.status {
    position: absolute;
    width: 12px;
    height: 12px;
    left: 32px;
    top: 32px;

    border-radius: 12px;
    background: #44b481;
    border: 4px solid #293040;
}

.server:nth-child(1) {
    margin-bottom: 5px;
}

.server:nth-child(3) {
    margin-top: 5px;
}

.server-divider {
    height: 2px;
    width: 24px;
    margin-left: 24px;
    background: #31394d;
    border-radius: 4px;
}

.top-bar {
    height: 48px;
}

.is-active {
    display: block;
}

.servers-div.is-active {
    display: flex;
}

.selected {
    background: #3a4259;
    /* text-decoration: underline; */
    cursor: default;
}

.server.selected {
    background: none;
    /* border: 2px solid #18a0fb; */
}
.server.selected p {
    /* border-radius: 290487px; */
    /* border: 2px solid #18a0fb; */
    /* box-shadow: inset 0px 0px 0px 10px #f00; */
}

.badge {
    background: #1787ff;
    border-radius: 290486px;
    padding-left: 6px;
    padding-right: 6px;
    height: 20px;
    margin-top: 10px;
    margin-left: 10px;
}

.plus {
    width: 16px;
    height: 16px;
    vertical-align: middle;
    cursor: pointer;
    display: inline-block;
    text-align: right;
}

/* ----title bar---- */

.window-title-bar {
    width: 100vw;
    height: 32px;
    background: #293040;
    -webkit-user-select: none;
    -webkit-app-region: drag;
}

.window-name {
    width: 75px;
    height: 24px;
    font: Bold 16px Noto Sans TC;
    vertical-align: middle;
    line-height: 32px;
    margin-left: 12px;
}

/* ----self---- */

.self-status {
    text-align: right;
    font: 300 12px Noto Sans TC;
}

.self-username {
    text-align: right;
    font: Bold 16px Noto Sans TC;
    max-width: 112px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.self-avatar {
    margin-left: 9px;
}

.self {
    display: flex;
    margin-top: 38px;
    margin-right: 46px;
    float: right;
}

.avatar-img {
    box-shadow: 0px 0px 5px #1e7c33;
    border: 2px solid #1e7c33;
}

main {
    overflow: hidden;
    width: 100vw;
    height: 100vh;
}

.bottom {
    width: 420px;
    height: 55px;
    background: #040509;
    margin-top: 70px;
    border-radius: 0 0 8px 8px;
}

.modal-content h3 {
    font: Bold 24px Noto Sans TC;
    text-align: left;
}

.answer-call,
.decline-call,
.create-button,
.cancel-button {
    width: 286px;
    border: 0;
    color: white;
    height: 46px;
    border-radius: 5px;
    cursor: pointer;
    font: 300 14px Noto Sans TC;
}

.answer-call {
    margin-top: 42px;
    background: #1787ff;
}

.create-button {
    margin-top: 12px;
    margin-left: 8px;
    margin-right: 12px;
    width: 73px;
    height: 32px;
    background: #1787ff;
}

.cancel-button {
    margin-top: 12px;
    width: 73px;
    height: 32px;
    background: transparent;
}

.cancel-button:hover {
    text-decoration: underline;
}

.decline-call {
    margin-top: 10px;
    background: transparent;
    border: white;
    border-style: solid;
    border-width: 1px;
}

.decline-call:hover {
    text-decoration: underline;
}

.create-button:hover,
.answer-call:hover {
    opacity: 0.9;
}

.loading {
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;
    display: none;
}

.dev {
    display: inline;
}

.loading.is-active {
    display: block;
}

.caller {
    margin-top: 32px;
    text-align: center;
}

.caller h3 {
    font: Bold 24px Noto Sans TC;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.caller h4 {
    font: Bold 16px Noto Sans TC;
}

.caller p {
    display: block;
    margin-left: auto;
    margin-right: auto;
}

.none {
    display: none;
}

.enabled {
    -webkit-animation: blur 0.5s;
    -webkit-animation: zoom 0.5s;
}

.disabled {
    -webkit-animation: focus 0.5s;
    -webkit-animation: blur 0.5s;
}

.banner {
    height: 32px;
    line-height: 32px;
    margin-bottom: -32px;
    background: repeating-linear-gradient(
        -45deg,
        #1787ff,
        #1787ff 20px,
        #1165bf 20px,
        #1165bf 40px
    );
    padding-left: 60px;
    width: calc(100vw - 247px - 266px - 60px);
    position: absolute;
}

/* ----message---- */

.message {
    display: flex;
    background: rgba(0, 0, 0, 0);
    margin-top: 18px;
    margin-left: 40px;
}
.message-container:hover {
    background-color: #2d3345;
}

.messages-divider {
    width: calc(100vw - 247px - 266px - 32px - 64px);
    margin-left: 16px;
    height: 1px;
    background: #0c0f1d;
    margin-top: 18px;
    text-align: center;
}

.messages-divider[day]::after {
    content: attr(day);
    padding: 0.4rem 0.4rem;
    font-size: smaller;
    -webkit-transform: translateY(-1rem);
    display: inline-block;
    text-align: center;
    background: #080a13;
}

.no-extra {
    margin-top: 0px;
    margin-left: 89px;
}

.no-extra > div > img {
    margin-top: 0px;
}

.messages > div:first-of-type {
    margin-top: 57px;
}

.messages > div:last-child {
    margin-bottom: 47px;
}

.message-content {
    width: calc(100vw - 247px - 266px - 177px - 64px);
    overflow-wrap: break-word;
}

.message-avatar {
    margin-right: 9px;
}

.message-username {
    font: Bold 16px Noto Sans TC;
    cursor: pointer;
    max-width: 150px;
    width: max-content;
}

.message-username:hover {
    text-decoration: underline;
}

.message-text {
    font: 16px Noto Sans TC;
    user-select: text;
}

.message-image {
    max-width: 560px;
    max-height: 315px;
    border-radius: 8px;
    cursor: pointer;
    margin-top: 10px;
}

.message-video {
    margin-top: 10px;
    border-radius: 8px;
}

/* ----messages---- */
.messages {
    overflow-x: hidden;
    overflow-y: scroll;

    /* flex-grow: 1; */
    height: calc(100vh - 17px - 48px - 17px - 32px - 48px);
    scrollbar-width: none;
}

/* ----type area---- */
.type-area {
    width: calc(100vw - 247px - 266px - 80px - 48px - 64px);
    height: 38px;
    line-height: 38px;
    margin-left: 40px;
    background: #2d3345;
    border: 0px;
    border-radius: 10px;
    color: white;
    font: 300 16px Noto Sans TC;
    resize: none;
    margin-top: 17px;
    outline: none;
    padding-left: 48px;
    padding-top: 10px;
}

.type-area::placeholder {
    color: rgba(255, 255, 255, 0.25);
}

.area-container svg {
    position: absolute;
    margin-left: 54px;
    margin-top: 28px;
    width: 24px;
    height: 24px;
    color: #1787ff;
    cursor: pointer;
}

@media only screen and (max-width: 700px) {
    html,
    body {
        overflow: hidden;
    }

    body {
        position: relative;
    }

    .server-panel {
        height: 100vh;
        margin-right: -64px;
        z-index: 2;
    }

    .area-container svg {
        margin-left: 32px;
        margin-top: 28px;
        width: 24px;
        height: 24px;
    }

    .area-divider {
        width: calc(100vw - 16px);
        margin-left: 8px;
    }

    .messages-divider {
        width: calc(100vw - 16px);
        margin-left: 8px;
    }

    .right-panel {
        display: none;
        margin-left: -247px;
        height: 100vh;
    }

    .left-panel {
        /* display: none; */
        margin-right: -100vw;
        width: calc(100vw - 72px);
        height: 100vh;
        z-index: 1;
    }

    .window-title-bar {
        display: none;
    }

    .center-panel {
        width: 100vw;
        height: 100vh;
    }

    .messages {
        height: calc(100vh - 17px - 48px - 17px);
    }

    .type-area {
        width: calc(100vw - 32px - 48px);
        margin-left: 16px;
        margin-top: 17px;
    }

    .wrap {
        width: 100vw;
    }

    .message-content {
        width: calc(100vw - 127px);
    }

    .message {
        margin-left: 30px;
    }
}

/* ----misc---- */
.is-rounded {
    border-radius: 290486px;
}

.is-rounded:hover {
    /* opacity: 0.7; */
    cursor: pointer;
}

figure {
    margin-top: 4px;
}

.is-40x40 {
    height: 40px;
    width: 40px;
}

.is-40x40 img {
    height: 40px;
    width: 40px;
}

.is-48x48 {
    height: 48px;
    width: 48px;
}

.is-48x48 img {
    height: 48px;
    width: 48px;
}

.is-64x64 {
    height: 64px;
    width: 64px;
}

.is-64x64 img {
    height: 64px;
    width: 64px;
}

.is-128x128 {
    height: 128px;
    width: 128px;
}

.is-128x128 img {
    height: 128px;
    width: 128px;
}

.timestamp {
    font-size: 12px;
    color: #cbcbcb;
    user-select: text;
}

.call {
    width: 247px;
    height: 192px;
}

#avatar-up,
#image-up {
    /* opacity: 0; */
    position: absolute;
    height: 100%;
    width: 100%;
    display: none;
}

::-webkit-scrollbar {
    width: 5px;
    /* background-color: #31394d; */
}

::-webkit-scrollbar-track {
    opacity: 0;
}

::-webkit-scrollbar-thumb {
    background: #293041;
    transition: 0.2s;
    border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
    background: #293041;
    transition: 0.2s;
    border-radius: 2px;
}

.modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    transition: opacity 0.3s ease;
}

.modal-container {
    width: 420px;
    height: 174px;
    margin: 40px auto;
    background-color: #06070e;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.modal-footer {
    width: 420px;
    height: 55px;
    background-color: #040509;
    border-radius: 0 0 8px 8px;
    margin-top: 19px;
    transition: all 0.3s ease;
}

.modal-header h3 {
    margin-left: 20px;
    margin-top: 11px;

    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    display: inline-block;

    color: #ffffff;
}

.modal-body {
}

.text-right {
    text-align: right;
}

.form-label {
    margin-left: 20px;
    margin-top: 44px;

    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 17px;

    color: #ffffff;
}

.form-label > .form-control {
    margin-top: 3px;
}

.form-control {
    width: 368px;
    height: 36px;
    line-height: 36px;
    background: #040509;
    border: 0px;
    border-radius: 8px;
    color: white;
    font: 300 16px Noto Sans TC;
    outline: none;
    padding-left: 12px;
    margin-left: 20px;
}

.modal-enter {
    opacity: 0;
}

.modal-leave-active {
    opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
}
</style>
