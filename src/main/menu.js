import {openFile, saveFileAs, saveFile, importDataPackage} from './file.js'
import {createWindowTab, focusMainWindow} from './windows.js'
import {importExcel} from './excel.js'
import {showKeyboardHelp} from './help.js'
import {fileFormats} from '../renderer/file-formats.js'
import {shell, BrowserWindow, Menu} from 'electron'

// build 'Open...' and 'Save As...' submenus
const open_submenu = []
const save_submenu = []
for (const format in fileFormats) {
  const open_option = {
    label: fileFormats[format].label,
    click: ((format => () => {
      openFile(format)
    })(fileFormats[format]))
  }
  if (format === 'csv') {
    open_option.accelerator = 'CmdOrCtrl+O'
  }
  open_submenu.push(open_option)
  const save_option = {
    label: fileFormats[format].label,
    click: ((format => () => {
      saveFileAs(format)
    })(fileFormats[format]))
  }
  if (format === 'csv') {
    save_option.accelerator = 'Shift+CmdOrCtrl+S'
  }
  save_submenu.push(save_option)
}
// Placeholder for Custom Dialect feature
// open_submenu.push({
//   label: 'Custom Dialect...',
//   enabled: false,
//   click: function() {
//     fileActions.openCustom()
//   }
// })
// save_submenu.push({
//   label: 'Custom Dialect...',
//   enabled: false,
//   click: function() {
//     fileActions.saveAsCustom()
//   }
// })

const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New',
        accelerator: 'CmdOrCtrl+N',
        click() {
          createWindowTab()
        }
      }, {
        type: 'separator'
      }, {
        label: 'Open',
        submenu: open_submenu
      }, {
        label: 'Open Excel Sheet...',
        enabled: true,
        click() {
          importExcel()
        }
        // Placeholder for future feature
        //      }, {
        //        label: 'Open Google Sheet...',
        //        enabled: false
      }, {
        label: 'Open Data Package...',
        enabled: true,
        click() {
          importDataPackage()
        }
        // Placeholder for future feature
        //      }, {
        //        label: 'Open Recent',
        //        submenu: [
        //          {
        //            label: 'example.csv',
        //            enabled: false
        //          }, {
        //            type: 'separator'
        //          }, {
        //            label: 'Clear Menu',
        //            enabled: false
        //          }
        //        ]
        // Placeholder for non-macOS Settings for future feature
        //      }, {
        //        type: 'separator'
        //      }, {
        //        label: 'Settings',
        //        enabled: false
      }, {
        type: 'separator'
      }, {
        label: 'Save',
        accelerator: 'CmdOrCtrl+S',
        click() {
          saveFile()
        },
        id: 'save',
        enabled: false
      }, {
        label: 'Save As',
        submenu: save_submenu
      }
      // hide until needed
      //, {
      //  type: 'separator'
      // }
      // hide until implemened
      //, {
      //  label: 'Close Tab',
      //  accelerator: 'CmdOrCtrl+W'
      // }
    ]
  }, {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        click() {
          webContents().send('editUndo')
        }
      }, {
        label: 'Redo',
        accelerator: process.platform === 'darwin'
          ? 'Shift+CmdOrCtrl+Z'
          : 'CmdOrCtrl+Y',
        click() {
          webContents().send('editRedo')
        }
      }, {
        type: 'separator'
      },
      // electron roles for copy/cut/paste seem to be more reliable than equivalent for hot
      {
        role: 'cut',
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X'
      }, {
        role: 'copy',
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C'
      }, {
        role: 'paste',
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V'
      },
      // {
      //    turned off for Beta release
      //    role: 'selectall',
      //   label: 'Select All',
      //   enabled: false,
      //   accelerator: 'CmdOrCtrl+A'
      // },
      {
        type: 'separator'
      }, {
        label: 'Insert Row Above',
        accelerator: 'CmdOrCtrl+I',
        click() {
          webContents().send('insertRowAbove')
        }
      }, {
        label: 'Insert Row Below',
        accelerator: 'CmdOrCtrl+K',
        click() {
          webContents().send('insertRowBelow')
        }
      }, {
        type: 'separator'
      }, {
        label: 'Insert Column Before',
        accelerator: 'CmdOrCtrl+J',
        click() {
          webContents().send('insertColumnLeft')
        }
      }, {
        label: 'Insert Column After',
        accelerator: 'CmdOrCtrl+L',
        click() {
          webContents().send('insertColumnRight')
        }
      }, {
        type: 'separator'
      }, {
        label: 'Remove Row(s)',
        click() {
          webContents().send('removeRows')
        }
      }, {
        label: 'Remove Column(s)',
        click() {
          webContents().send('removeColumns')
        }
      }
    ]
  }, {
    // Placeholder for future features
    //    label: 'Find',
    //    submenu: [
    //      {
    //        label: 'Find',
    //        accelerator: 'CmdOrCtrl+F',
    //        enabled: false
    //      }, {
    //        label: 'Find Next',
    //        accelerator: 'CmdOrCtrl+G',
    //        enabled: false
    //      }, {
    //        label: 'Find Previous',
    //        accelerator: 'Shift+CmdOrCtrl+G',
    //        enabled: false
    //      }, {
    //        type: 'separator'
    //      }, {
    //        label: 'Replace',
    //        accelerator: 'Alt+CmdOrCtrl+F',
    //        enabled: false
    //      }, {
    //        label: 'Replace Next',
    //        accelerator: 'Alt+CmdOrCtrl+E',
    //        enabled: false
    //      }, {
    //        label: 'Replace All',
    //        enabled: false
    //      }
    //    ]
    //  }, {
    label: 'Tools',
    submenu: [
      {
        label: 'Header Row',
        accelerator: 'Shift+CmdOrCtrl+H',
        type: 'checkbox',
        checked: false,
        click(menuItem) {
          // revert 'checked' toggle so only controlled by header row event
          menuItem.checked = !menuItem.checked
          webContents().send('toggleActiveHeaderRow')
        }
      },
      {
        label: 'Case Sensitive Header Row',
        type: 'checkbox',
        checked: false,
        click(menuItem) {
          // revert 'checked' toggle so only controlled by event
          menuItem.checked = !menuItem.checked
          webContents().send('toggleCaseSensitiveHeader')
        }
      }, {
        // Placeholder for future features
        //      }, {
        //        type: 'separator'
        //      }, {
        //        label: 'Import Column Properties...',
        //        enabled: false
        //      }, {
        //        type: 'separator'
        //      }, {
        //        label: 'Create Constraint from Column',
        //        enabled: false
        //      }, {
        //        label: 'Create Reference Table from Column',
        //        enabled: false
        // }, {
        //  type: 'separator'
        // }, {
        label: 'Guess Column Properties',
        accelerator: 'Shift+CmdOrCtrl+G',
        click: function() {
          webContents().send('guessColumnProperties')
        }
      }, {
        type: 'separator'
      }, {
        label: 'Set Column Properties',
        accelerator: process.env.NODE_ENV !== 'development' ? 'Shift+CmdOrCtrl+C' : 'Alt+CmdOrCtrl+C',
        click() {
          webContents().send('triggerMenuButton', 'Column')
        }
      }, {
        label: 'Set Table Properties',
        accelerator: 'Shift+CmdOrCtrl+T',
        click() {
          webContents().send('triggerMenuButton', 'Table')
        }
      }, {
        label: 'Set Provenance Information',
        accelerator: 'Shift+CmdOrCtrl+P',
        click() {
          webContents().send('triggerMenuButton', 'Provenance')
        }
      }, {
        label: 'Set Data Package Properties',
        accelerator: 'Shift+CmdOrCtrl+D',
        click() {
          webContents().send('triggerMenuButton', 'Package')
        }
      }, {
        type: 'separator'
      }, {
        label: 'Validate Table',
        accelerator: 'Shift+CmdOrCtrl+V',
        click() {
          webContents().send('validateTable')
        }
      }, {
        type: 'separator'
      }, {
        label: 'Export Data Package...',
        accelerator: 'Shift+CmdOrCtrl+X',
        click() {
          webContents().send('triggerMenuButton', 'Export')
        }
      }
      // Placeholder for future features
      //      , {
      // Conditionally enabled based on API keys set and Data Package Exported
      //        label: 'Publish Data Package to',
      //        enabled: false,
      //        submenu: [
      //          {
      //            label: 'CKAN',
      //            enabled: false
      //          , icon: '/static/img/locked.svg'
      //          }, {
      //            label: 'DataHub',
      //            enabled: false
      //          , icon: '/static/img/locked.svg'
      //          }, {
      //            label: 'OctoPub',
      //            enabled: false
      //          , icon: '/static/img/locked.svg'
      //          }
      //        ]
      //      }
    ]
  }, {
    label: 'Window',
    submenu: [
      {
        role: 'minimize'
        // hide until implemented
        // }, {
        //   type: 'separator'
        // }, {
        //   label: 'Next Tab',
        //   accelerator: 'CmdOrCtrl+Right'
        // }, {
        //   label: 'Previous Tab',
        //   accelerator: 'CmdOrCtrl+Left'
      }, {
        type: 'separator'
      }, {
        role: 'quit'
      }
    ]
  }, {
    role: 'help',
    submenu: [
      {
        // Placeholder for future features
        //        label: 'Data Curator Help',
        // show accelerator for Windows and Linux only
        //        accelerator: process.platform === 'darwin'
        //          ? ''
        //          : 'F1',
        // hide above
        //        click: function() {
        //          shell.openExternal('https://odiqueensland.github.io/data-curator-help/')
        //        }
        //      }, {
        label: 'Keyboard Shortcuts',
        accelerator: 'CmdOrCtrl+/',
        enabled: true,
        click() {
          showKeyboardHelp()
        }
      }, {
        type: 'separator'
      }, {
        label: 'Support Forum',
        click() {
          shell.openExternal('https://ask.theodi.org.au/c/projects/data-curator')
        }
      }, {
        label: 'Report Issues',
        click() {
          shell.openExternal('https://github.com/ODIQueensland/data-curator/blob/develop/.github/CONTRIBUTING.md')
        }
      }
      // Placeholder for future feature
      //      , {
      //        type: 'separator'
      //      }, {
      //        label: 'Welcome Guide',
      //        enabled: false
      //      }
    ]
  }
]

// Tailor menu for Windows - add About to Help menu
if (process.platform !== 'darwin') {
  template[4].submenu.push({
    type: 'separator'
  }, {
    label: 'About Data Curator',
    click: function() {
      webContents().send('showSidePanel', 'about')
    }
  })
}

// Tailor menu for macOS
if (process.platform === 'darwin') {
  template.unshift({
    label: 'Data Curator',
    submenu: [
      {
        label: 'About Data Curator',
        click: function() {
          webContents().send('showSidePanel', 'about')
        }
        // Placeholder for future feature
        //      }, {
        //        type: 'separator'
        //      }, {
        //        label: 'Preferences'
        //        accelerator: 'CmdOrCtrl+,',
        //        click: function() {
        //          webContents().send('showSidePanel', 'preferences')
        //        }
      }, {
        type: 'separator'
      }, {
        role: 'services',
        submenu: []
      }, {
        type: 'separator'
      }, {
        role: 'hide',
        label: 'Hide Data Curator'
      }, {
        role: 'hideothers'
      }, {
        role: 'unhide'
      }, {
        type: 'separator'
      }, {
        role: 'quit',
        label: 'Quit Data Curator'
      }
    ]
  })

  // overwrite Window menu
  template[4].submenu = [
    {
      role: 'minimize'
    }, {
      role: 'zoom'
      // hide until implemented
      // }, {
      //   type: 'separator'
      // }, {
      //   label: 'Next Tab',
      //   accelerator: 'CmdOrCtrl+Right'
      // }, {
      //   label: 'Previous Tab',
      //   accelerator: 'CmdOrCtrl+Left'
    }, {
      type: 'separator'
    }, {
      role: 'front'
    }
  ]
}

// Add developer tools menu to end if not in production environment
if (process.env.NODE_ENV !== 'production') {
  template.push({
    label: 'Developer',
    submenu: [
      {
        role: 'reload'
      }, {
        role: 'toggledevtools'
      }
    ]
  })
}

function webContents() {
  // use .fromId rather than .focusedWindow as latter does not apply if app minimized
  // use .fromId rather than .getAllWindows[0] as if child window present and main window minimized won't work
  let browserWindow = focusMainWindow()
  return browserWindow.webContents
}

export function getSubMenuFromMenu(menuLabel, subMenuLabel) {
  let menu = Menu.getApplicationMenu().items.find(x => x.label === menuLabel)
  let subMenu = menu.submenu.items.find(x => x.label === subMenuLabel)
  return subMenu
}

export function clickLabelsOnMenu(args) {
  let menu = Menu.getApplicationMenu().items.find(x => x.label === args[0])
  menu.click()
  let returnLabel = menu.label
  let subMenu
  if (args.length > 1) {
    subMenu = menu.submenu.items.find(x => x.label === args[1])
    subMenu.click()
    returnLabel = subMenu.label
  }
  if (args.length > 2) {
    let subSubMenu = subMenu.submenu.items.find(x => x.label === args[2])
    subSubMenu.click()
    returnLabel = subSubMenu.label
  }
  return returnLabel
}

export {
  template
}
