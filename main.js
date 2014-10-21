define(function (require, exports, module) {
    var CommandManager = brackets.getModule("command/CommandManager"),
        KeyBindingManager = brackets.getModule("command/KeyBindingManager"),
        NativeApp = brackets.getModule("utils/NativeApp"),
        EditorManager = brackets.getModule("editor/EditorManager"),
        PanelManager = brackets.getModule("view/PanelManager"),
        Menus = brackets.getModule("command/Menus");
    
    var isPanelVisible = false;
    
    var browserIframe,
        selectedText,
        browserPanel;
        
    CommandManager.register("Find on jqapi.com",
                            "jqapisearch.Find",
                            searchInReference);
    
    Menus.getMenu(Menus.AppMenuBar.FIND_MENU).addMenuItem("jqapisearch.Find");
    
    KeyBindingManager.addBinding("jqapisearch.Find", "Shift-Ctrl-Q");
    
    var browserInnerHtml = require("text!browser.html")
    
    function searchInReference() {
        selectedText = (EditorManager.getActiveEditor()).getSelectedText();
        
        if(!isPanelVisible) {
            isPanelVisible = true;
            toggleBrowser(isPanelVisible);
            window.setTimeout(function() {
                browserIframe.attr("src", "");
                window.setTimeout(populateBrowser, 0);
            });
        }
    }
    
    var bindEscKey = function() {
        browserIframe.contents().get(0).addEventListener("keydown", function (e) {
           if(e.keyCode === 27) {
                EditorManager.focusEditor();
                e.preventDefault();
                e.stopImmediatePropagation();
                isPanelVisible = !isPanelVisible;
                toggleBrowser(isPanelVisible);
            }
        });
    }
    
    var populateBrowser = function() {
        browserIframe.load(function () {
            bindEscKey();
        });
        browserIframe.attr("src", selectedText ? ("http://jqapi.com/#p=" + selectedText) : "http://jqapi.com/");
    }
    
    var toggleBrowser = function(isPanelVisible) {
        if(isPanelVisible) {
            if(browserPanel) browserPanel.show();
            else {
                var browser = $(browserInnerHtml);
                browserIframe = browser.find("#browserIframe"); 
                browserPanel = PanelManager.createBottomPanel("bottomPanel", browser);
                populateBrowser();
                
                browserPanel.show();
            }
        }
        else browserPanel.hide();
    }
});
