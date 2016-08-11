// Saves options to chrome.storage
var op_enable = document.getElementById('chkEnable'),
            op_ctrl = document.getElementById('chkCtrl'),
            op_alt = document.getElementById('chkAlt'),
            op_shift = document.getElementById('chkShift'),
            op_box = document.getElementById('chkBox'),
            op_width = document.getElementById('txtWidth'),
            op_height = document.getElementById('txtHeight'),
            op_top = document.getElementById('txtTop'),
            op_bottom = document.getElementById('txtBottom'),
            op_left = document.getElementById('txtLeft'),
            op_right = document.getElementById('txtRight'),
            op_search = document.getElementById('txtSearch');

function save_options() {
  var settings = {
    iFenable : op_enable.checked, 
    iFctrl : op_ctrl.checked,
    iFalt : op_alt.checked,
    iFshift : op_shift.checked,
    iFbox : op_box.checked,
    iFwidth : op_width.value,
    iFheight : op_height.value,
    iFtop : op_top.value,
    iFbottom : op_bottom.value,
    iFleft : op_left.value,
    iFright : op_right.value,
    iFsearch : op_search.value
  };
  
  chrome.storage.local.set({'iFrameOptions': settings}, function() {
      var status = document.getElementById('status');
      status.textContent = 'Options saved!';
  });
}

// Restores checkbox and textbox states using the preferences
// stored in chrome.storage.local
function restore_options() {
  var settings = {};

  chrome.storage.local.get({iFrameOptions: {
    // default values
    iFenable : true,
    iFctrl : false,
    iFalt : false,
    iFshift : false,
    iFbox : true,
    iFwidth : '',
    iFheight : '',
    iFtop : '5%',
    iFbottom : '',
    iFleft : '',
    iFright : '5%',
    iFsearch : 'https://www.duckduckgo.com/?q=%s'
  }}, function(items) {
    settings = items.iFrameOptions;

    op_enable.checked = settings.iFenable;
    op_ctrl.checked = settings.iFctrl;
    op_alt.checked = settings.iFalt;
    op_shift.checked = settings.iFshift;
    op_box.checked = settings.iFbox;
    op_width.value = settings.iFwidth;
    op_height.value = settings.iFheight;
    op_top.value = settings.iFtop;
    op_left.value = settings.iFleft;
    op_right.value = settings.iFright;
    op_search.value = settings.iFsearch;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);