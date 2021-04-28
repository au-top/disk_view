import $ from "jquery";
export const CreateDiskElem=(diskName:string)=> `
<div class="diskElem">
    <div>${diskName}</div>
</div>
`;


export const CreateDiskConTool=()=>`
<div class="diskConToolBox flexBox">
    <button class="clearAppCache">清除软件缓存</button>
</div>
`;

export const CreateLoadBox=()=>`
<div class="loadTipsBox">
<div class="loadTips">
    <div class="loadTipsElem"></div>
    <div class="loadTipsElem"></div>
    <div class="loadTipsElem"></div>
    <div class="loadTipsElem"></div>
    <div class="loadTipsElem"></div>
    <div class="loadTipsElem"></div>
</div>
</div>
`;