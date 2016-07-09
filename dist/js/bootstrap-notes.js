/*! markdown-notepad v0.1.0 2016-07-09 */
!function(a){"use strict";"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?a(require("jquery")):window.jQuery&&a(window.jQuery)}(function(a){function b(a,b){var c=document.createElement("a");if(c.setAttribute("href",a),c.setAttribute("download",b),document.createEvent){var d=document.createEvent("MouseEvents");d.initEvent("click",!0,!0),c.dispatchEvent(d)}else c.click()}var c=function(){};c.prototype={get:function(a,b){if("undefined"!=typeof chrome&&chrome.storage)chrome.storage.local.get(a,function(c){"function"==typeof b&&b(c[a])});else{var c=null;window.localStorage&&(c=window.localStorage.getItem(a)),"function"==typeof b&&b(c)}},set:function(a,b,c){if("undefined"!=typeof chrome&&chrome.storage){var d={};d[a]=b,chrome.storage.local.set(d)}else window.localStorage&&window.localStorage.setItem(a,b),"function"==typeof c&&c()}};var d=new c,e=function(a){this._opt=a,this._d={}};e.prototype={constructor:e,setItem:function(a,b){var c=this;b?c._d[a]=b:delete c._d[a]},getItem:function(a){return this._d[a]},save:function(a){var b=this,c=b._opt;for(var e in b._d){var f=b._d[e];"object"!=typeof f||f.d||delete b._d[e]}d.set(c.id,JSON.stringify(b._d),a)},load:function(b){var c=this,e=c._opt;d.get(e.id,function(d){d&&"string"==typeof d&&(c._d=a.parseJSON(d)),"function"==typeof b&&b(c._d)})},find:function(a){var b=this,c=b._d;for(var d in c)if(a(c[d],d))return c[d]}};var f=function(b,c){var d=this;d._el=b,d._opt=c,d._msgbox=c.msgbox,d._adapter=c.adapter,d._autoSaveInterval=c.autoSaveInterval||6e5,d._initTime=(new Date).getTime(),d._store=new e({id:c.id||"__notes"});var f=a(".notes-tab",b).notestab({msgbox:c.msgbox}).on("closed.bs.tab",a.proxy(d._tabClosed,d)).on("close.bs.tab",a.proxy(d._tabClose,d)).on("selected.bs.tab",a.proxy(d._tabSelected,d)).on("created.bs.tab",a.proxy(d._tabCreated,d)).on("shown.bs.tab",a.proxy(d._tabShown,d)).on("rename.bs.tab",a.proxy(d._tabRename,d));d._notestab=f[0],d._store.load(function(b){var c=[];for(var e in b)"__ctxUid"===e?d._ctxUid=b[e]:c[c.length]=b[e];c.length>0?(f.notestab("create",c),d._ctxUid?a("a",a("li[data-note-uid="+d._ctxUid+"]",f)).tab("show"):a("a",a("li:first",f)).tab("show")):f.notestab("createUntitled")}),a(d._adapter).on("edit.ntadapter",a.proxy(d._edit,d)),a(b).on("click","a[data-nts-cmd], button[data-nts-cmd]",a.proxy(d._cmd,d)),setInterval(function(){d.save2LocalStore()},d._autoSaveInterval)};f.prototype={constructor:f,_edit:function(b,c){var d=this,e=d.note(d._ctxUid);e&&e.d!==c&&(e.unsaved=!0,e.d=c||a(d._adapter).data("ntadapter").data(),a(d._notestab).notestab("markUnsaved",!1,e))},_tabClose:function(a,b){var c=this;c.close(b)},_tabClosed:function(b,c){var d=this,e=d._store,f=a(d._notestab).data("notestab"),g=d.note(c);g&&delete g.d,0===f.count()&&(a(d._adapter).ntadapter("data",g),f.createUntitled()),e.setItem(c)},_tabSelected:function(b,c){var d=this,e=d.note(c);d._ctxUid=c,a(d._adapter).ntadapter("data",e)},_tabCreated:function(b,c){var d=this,e=a(d._notestab).data("notestab");if(e.count()>1){var f=d.note(d._ctxUid);!f||f.unsaved||f.d||0!==f.name.indexOf("Untitled")||e.close(f.uid)}d.note(c.uid,c),a(d._adapter).ntadapter("data",c)},_tabShown:function(b){var c=this,d=a(b.target).parent().data("note-uid");c._ctxUid=d,a(c._adapter).ntadapter("data",c.note(d))},_tabRename:function(b,c,d){var e=this,f=e.note(c);d?(f.name=d,a(e._notestab).notestab("doRename",f)):"undefined"!=typeof chrome&&chrome.storage&&f.savedId&&chrome.fileSystem.restoreEntry(f.savedId,function(a){e._chromeSaveAs(f.name,f.d,e._chromeSaved(f,function(){a.remove(function(){console.log("removed")})}))})},_cmd:function(b){var c=this,d=a(b.currentTarget).data("nts-cmd"),e=a(c._notestab),f=e.data("notestab"),g=c.activeFile();switch(d){case"save":c.saveLocal();break;case"saveas":c.saveLocal({uid:g.uid,name:g.name,d:g.d},function(a){c.note(a.uid,a)});break;case"new":a(c._notestab).notestab("createUntitled");break;case"open":c.open();break;case"close":c.close();break;case"closeOthers":f.closeOthers(g.uid);break;case"closeAll":f.closeAll();break;case"rename":f.rename();break;case"shutdown":c.save2LocalStore(),"undefined"!=typeof chrome&&chrome.app&&chrome.app.window.current().close();break;case"maximize":"undefined"!=typeof chrome&&chrome.app&&(chrome.app.window.current().isMaximized()?chrome.app.window.current().restore():chrome.app.window.current().maximize());break;case"minimize":"undefined"!=typeof chrome&&chrome.app&&chrome.app.window.current().minimize();break;default:a(c._el).trigger("cmd.nts",[d])}},note:function(a,b){var c=this,d=c._store;return b?void d.setItem(a,b):d.getItem(a)},open:function(){var b=this;b.openLocal(function(c){a(b._notestab).notestab("create",c,!0)})},_chromeReadFile:function(b,c){var d=this,e=d._store;return function(f){chrome.fileSystem.getDisplayPath(c,function(g){var h=e.find(function(a){return console.log(a.path),g===a.path});if(h)a(d._notestab).notestab("selectTab",h);else{var i=chrome.fileSystem.retainEntry(c);d._readFile(f,function(a){b({name:c.name,d:a.target.result,path:g,savedId:i})})}})}},openLocal:function(b){var c=this,d=a(c._msgbox).data("msgbox");if("undefined"!=typeof chrome&&chrome.fileSystem)chrome.fileSystem.chooseEntry({type:"openFile",acceptsMultiple:!0},function(a){if(!chrome.runtime.lastError&&a)for(var e=function(a){d.alert(a)},f=0;f<a.length;f++)a[f].file(c._chromeReadFile(b,a[f]),e)});else{var e=a("#_openFile");0===e.length&&(e=a('<input type="file" name="file" multiple />')),e.on("change",a.proxy(c._loadLocal,c)).on("load",function(c,d,e,f){b({name:f[e].name,d:d}),e===f.length-1&&a(c.target).remove()}).click()}},openRemote:function(b){var c=this,d=b.url||b||prompt("Remote URL:","http://");if(d){var e=document.createElement("a");e.href=d;var f=e.pathname.split("/").pop(),g={name:f,d:"> Loading...",readOnly:!0};"string"!=typeof b&&(g=a.extend(g,b)),a(c._notestab).notestab("create",g,!0),a.ajax({url:d,success:function(b){g.d=b,a(c._adapter).ntadapter("data",g)},error:function(b,d,e){g.d="> Load failure!!!\n"+(d||e),a(c._adapter).ntadapter("data",g)}})}},close:function(b){var c=this,d=a(c._notestab).data("notestab"),e=c.note(b||d.activeUid()),f=a(c._msgbox).data("msgbox");e&&!e.unsaved?d.close(b):f.confirm('Save file "'+e.name+'"?',function(a){switch(a){case 1:c.saveLocal(e),d.close(b);break;case-1:d.close(b)}},"Save")},saveLocal:function(c,d){var e=this,f=e._opt,g="."+(f.suffix||"txt"),h=a(e._notestab).data("notestab"),i=c||e.note(h.activeUid());if(e.save2LocalStore(),i){var j=i.d||"",k=i.name;if(k+=-1===k.lastIndexOf(".")?g:"","undefined"!=typeof chrome&&chrome.fileSystem)i.savedId?chrome.fileSystem.isRestorable(i.savedId,function(b){b?chrome.fileSystem.restoreEntry(i.savedId,function(b){b&&e._chromeWriteFile(b,j,function(){i.unsaved=!1,a(e._notestab).notestab("markUnsaved",!0)})}):e._chromeSaveAs(k,j,e._chromeSaved(i,d))}):e._chromeSaveAs(k,j,e._chromeSaved(i,d));else{if(window.saveAs)window.saveAs(new Blob([j],{type:f.mime||"text/plain"}),k);else if(navigator.msSaveBlob)navigator.msSaveBlob(new Blob([j],{type:f.mime||"text/plain"}),k);else{var l="data:"+(f.mime||"text/plain")+";charset=utf-8,"+encodeURIComponent(j);b(l,k)}a(e._notestab).notestab("markUnsaved",!0)}}},_chromeSaved:function(b,c){var d=this;return function(e){b.savedId=chrome.fileSystem.retainEntry(e),b.path=e.fullPath,b.name=e.name,b.unsaved=!1,a(d._notestab).notestab("markUnsaved",!0).notestab("doRename",b),"function"==typeof c&&c(b,e)}},_chromeWriteFile:function(a,b,c){var d=this,e=d._opt;a.createWriter(function(d){var f=!1;d.onwriteend=function(){return f?void("function"==typeof c&&c(a)):(f=!0,void this.truncate(this.position))},d.write(new Blob([b],{type:e.mime||"text/plain"}))},function(a){console.log(a)})},_chromeSaveAs:function(a,b,c){var d=this;chrome.fileSystem.chooseEntry({type:"saveFile",suggestedName:a},function(a){!chrome.runtime.lastError&&a&&d._chromeWriteFile(a,b,c)})},_noteLoad:function(a,b,c){return function(d){var e=d.target.result;c.trigger("load",[e,a,b])}},_loadLocal:function(b){for(var c=this,d=a(b.target),e=d[0].files,f=0;f<e.length;f++){var g=e.item(f);c._readFile(g,a.proxy(c._noteLoad,c)(f,e,d))}},_readFile:function(a,b){var c=new FileReader;c.onload=b,/\.(txt|md|js|xml|html|json)$/i.test(a.name)?c.readAsText(a):c.readAsDataURL(a)},save2LocalStore:function(){var a=this;if(a._ctxUid){var b=a.note(a._ctxUid);b&&b.d&&a._store.setItem("__ctxUid",a._ctxUid)}a._store.save()},_localStorage:function(){return d},hotkey:function(b){var c=this,d=a(c._notestab),e=!1;if(b.ctrlKey)switch(b.which){case 84:d.notestab("createUntitled"),e=!0;break;case 79:c.open(),e=!0;break;case 83:c.saveLocal(),e=!0;break;case 87:c.close(),e=!0;break;case 116:}e&&(b.preventDefault(),b.stopPropagation())},activeFile:function(){var b=this,c=a(b._notestab).data("notestab");return b.note(c.activeUid())}},a.fn.notes=function(b){var c=arguments;return this.each(function(){var d=a(this),e=d.data("notes"),g="object"==typeof b?b:{};e||"string"==typeof b?"string"==typeof b&&e[b].apply(e,Array.prototype.slice.call(c,1)):d.data("notes",new f(this,g))})}});