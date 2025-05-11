/* EasyCal – Enhanced with Marketing Features */
document.addEventListener('DOMContentLoaded', () => {

  /* shorthand */
  const $ = id => document.getElementById(id);

  /* Original form refs */
  const eventTitle = $('eventTitle');
  const startDate = $('startDate');
  const startTime = $('startTime');
  const endDate = $('endDate');
  const endTime = $('endTime');
  const timezone = $('timezone');
  const locationInp = $('location');
  const desc = $('description');
  const organizer = $('organizer');
  const organizerEmail = $('organizerEmail');
  
  const previewTitle = $('previewTitle');
  const previewDateTime = $('previewDateTime');
  const previewTimezone = $('previewTimezone');
  const previewLocation = $('previewLocation');
  const previewOrganizer = $('previewOrganizer');
  const previewDescription = $('previewDescription');
  
  const snippetCode = $('snippetCode');
  const createButton = $('createButton');
  const cancelButton = $('cancelButton');
  const toast = $('copySuccess');

  /* === Smart Description Editor === */
  class SmartDescriptionEditor {
    constructor() {
      this.editor = $('smartEditor');
      this.textarea = $('description');
      this.toolbar = $('smartToolbar');
      this.platformIndicator = $('currentPlatform');
      this.helpText = $('platformHelpText');
      
      this.selectedPlatforms = new Set();
      this.init();
    }
    
    init() {
      // Listen for platform changes from the calendar checkboxes
      document.querySelectorAll('[id^="plt"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
          this.updatePlatformSettings();
        });
      });
      
      // Setup toolbar events
      this.toolbar.addEventListener('click', (e) => {
        const formatBtn = e.target.closest('[data-format]');
        if (formatBtn) {
          e.preventDefault();
          this.applyFormat(formatBtn.dataset.format);
        }
      });
      
      // Update content on input
      this.editor.addEventListener('input', () => {
        this.syncContent();
        updatePreview();
      });
      
      // Auto-detect user's preferred platform
      this.updatePlatformSettings();
    }
    
    updatePlatformSettings() {
      this.selectedPlatforms.clear();
      
      // Get selected platforms
      if ($('pltGoogle')?.checked) this.selectedPlatforms.add('google');
      if ($('pltOutlook')?.checked) this.selectedPlatforms.add('outlook');
      if ($('pltYahoo')?.checked) this.selectedPlatforms.add('yahoo');
      if ($('pltApple')?.checked) this.selectedPlatforms.add('apple');
      if ($('pltOutlookCom')?.checked) this.selectedPlatforms.add('outlookcom');
      if ($('pltOffice365')?.checked) this.selectedPlatforms.add('office365');
      
      // Determine formatting strategy
      const strategy = this.getFormattingStrategy();
      this.updateUI(strategy);
    }
    
    getFormattingStrategy() {
      if (this.selectedPlatforms.size === 0) {
        return 'universal';
      }
      
      // If only Google is selected, enable rich formatting
      if (this.selectedPlatforms.size === 1 && this.selectedPlatforms.has('google')) {
        return 'rich';
      }
      
      // If multiple platforms or includes Apple/ICS, use simple formatting
      if (this.selectedPlatforms.has('apple') || this.selectedPlatforms.size > 2) {
        return 'simple';
      }
      
      // Default to universal (most compatible)
      return 'universal';
    }
    
    updateUI(strategy) {
      switch(strategy) {
        case 'rich':
          this.platformIndicator.textContent = 'Google Calendar';
          this.helpText.textContent = 'Full formatting support enabled';
          this.enableAllFormatting();
          break;
          
        case 'simple':
          this.platformIndicator.textContent = 'multiple platforms';
          this.helpText.textContent = 'Basic formatting (bold, italic, links, lists)';
          this.enableSimpleFormatting();
          break;
          
        case 'universal':
          this.platformIndicator.textContent = 'all platforms';
          this.helpText.textContent = 'Universal plain text - works everywhere';
          this.disableFormatting();
          break;
      }
    }
    
    enableAllFormatting() {
      this.toolbar.querySelectorAll('button').forEach(btn => {
        btn.classList.remove('formatting-disabled');
      });
    }
    
    enableSimpleFormatting() {
      this.toolbar.querySelectorAll('button').forEach(btn => {
        const format = btn.dataset.format;
        if (['bold', 'italic', 'bulletList', 'link'].includes(format)) {
          btn.classList.remove('formatting-disabled');
        } else {
          btn.classList.add('formatting-disabled');
        }
      });
    }
    
    disableFormatting() {
      this.toolbar.querySelectorAll('button').forEach(btn => {
        btn.classList.add('formatting-disabled');
      });
    }
    
    applyFormat(format) {
      if (this.isFormatDisabled(format)) return;
      
      this.editor.focus();
      
      switch(format) {
        case 'bold':
          document.execCommand('bold', false, null);
          break;
        case 'italic':
          document.execCommand('italic', false, null);
          break;
        case 'underline':
          if (this.getFormattingStrategy() === 'rich') {
            document.execCommand('underline', false, null);
          }
          break;
        case 'bulletList':
          this.insertBulletList();
          break;
        case 'link':
          this.insertLink();
          break;
      }
      
      this.syncContent();
    }
    
    isFormatDisabled(format) {
      const strategy = this.getFormattingStrategy();
      
      if (strategy === 'universal') return true;
      if (strategy === 'simple' && format === 'underline') return true;
      
      return false;
    }
    
    insertBulletList() {
      const selection = window.getSelection();
      if (!selection.rangeCount) return;
      
      const range = selection.getRangeAt(0);
      
      // Simple bullet list implementation
      const text = '• ';
      const textNode = document.createTextNode(text);
      range.insertNode(textNode);
      range.setStartAfter(textNode);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    
    insertLink() {
      const selectedText = window.getSelection().toString();
      const url = prompt('Enter URL:', 'https://');
      
      if (url && url !== 'https://') {
        const linkText = selectedText || url;
        if (this.getFormattingStrategy() === 'rich') {
          document.execCommand('createLink', false, url);
        } else {
          // Insert as plain text link for better compatibility
          document.execCommand('insertText', false, `${linkText} (${url})`);
        }
      }
    }
    
    syncContent() {
      const strategy = this.getFormattingStrategy();
      
      // Get content based on formatting strategy
      if (strategy === 'universal') {
        this.textarea.value = this.editor.innerText;
      } else {
        this.textarea.value = this.getCompatibleText();
      }
    }
    
    getCompatibleText() {
      // Convert HTML to a format that works across platforms
      let text = this.editor.innerHTML;
      
      // Handle bold
      text = text.replace(/<strong>(.*?)<\/strong>/gi, (match, content) => {
        if (this.selectedPlatforms.has('google')) return content;
        return content.toUpperCase();
      });
      
      text = text.replace(/<b>(.*?)<\/b>/gi, (match, content) => {
        if (this.selectedPlatforms.has('google')) return content;
        return content.toUpperCase();
      });
      
      // Handle italic
      text = text.replace(/<em>(.*?)<\/em>/gi, (match, content) => {
        if (this.selectedPlatforms.has('google')) return content;
        return `*${content}*`;
      });
      
      text = text.replace(/<i>(.*?)<\/i>/gi, (match, content) => {
        if (this.selectedPlatforms.has('google')) return content;
        return `*${content}*`;
      });
      
      // Handle links
      text = text.replace(/<a href="(.*?)">(.*?)<\/a>/gi, (match, url, text) => {
        return `${text} (${url})`;
      });
      
      // Clean up HTML
      text = text.replace(/<br\s*\/?>/gi, '\n');
      text = text.replace(/<[^>]*>/g, '');
      text = text.replace(/&nbsp;/g, ' ');
      
      return text;
    }
  }

  /* === Enhanced Preview with Marketing Features === */
  class EnhancedPreview {
    constructor() {
      this.isButtonFormat = true;
      this.currentStyle = 1;
      this.selectedPlatforms = new Set(['apple', 'google', 'outlook', 'outlookCom', 'office365', 'yahoo']);
      this.configuration = {
        color: 'default',
        style: 'filled',
        textIcon: 'icon+text',
        size: '36px',
        customText: 'Add to Calendar'
      };
      this.init();
    }
    
    init() {
      // Format switcher
      $('buttonFormat').addEventListener('click', () => this.setFormat(true));
      $('linksFormat').addEventListener('click', () => this.setFormat(false));
      
      // Style switcher
      $('style1').addEventListener('click', () => this.setStyle(1));
      $('style2').addEventListener('click', () => this.setStyle(2));
      $('newStyle').addEventListener('click', () => this.openAdvancedConfig());
      
      // Platform selection
      document.querySelectorAll('[id^="plt"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
          const platform = e.target.id.replace('plt', '').toLowerCase();
          if (e.target.checked) {
            this.selectedPlatforms.add(platform);
          } else {
            this.selectedPlatforms.delete(platform);
          }
          this.updatePreview();
        });
      });
      
      // Update preview on form changes
      [eventTitle, startDate, startTime, endDate, endTime, timezone, locationInp, organizer, organizerEmail]
        .forEach(input => {
          if (input) {
            input.addEventListener('input', () => this.updatePreview());
          }
        });
        
      // Initial preview update
      this.updatePreview();
    }
    
    setFormat(isButton) {
      this.isButtonFormat = isButton;
      
      // Update UI
      const buttonBtn = $('buttonFormat');
      const linksBtn = $('linksFormat');
      
      if (isButton) {
        buttonBtn.classList.add('bg-primary', 'text-white');
        buttonBtn.classList.remove('bg-gray-100', 'text-gray-700');
        linksBtn.classList.add('bg-gray-100', 'text-gray-700');
        linksBtn.classList.remove('bg-primary', 'text-white');
        
        $('buttonCustomization').classList.remove('hidden');
        $('buttonPreview').classList.remove('hidden');
        $('linksPreview').classList.add('hidden');
        $('buttonUseCase').classList.remove('hidden');
        $('linksUseCase').classList.add('hidden');
      } else {
        linksBtn.classList.add('bg-primary', 'text-white');
        linksBtn.classList.remove('bg-gray-100', 'text-gray-700');
        buttonBtn.classList.add('bg-gray-100', 'text-gray-700');
        buttonBtn.classList.remove('bg-primary', 'text-white');
        
        $('buttonCustomization').classList.add('hidden');
        $('buttonPreview').classList.add('hidden');
        $('linksPreview').classList.remove('hidden');
        $('buttonUseCase').classList.add('hidden');
        $('linksUseCase').classList.remove('hidden');
      }
      
      this.updatePreview();
      this.generateCode();
    }
    
    setStyle(styleNum) {
      this.currentStyle = styleNum;
      
      const style1Btn = $('style1');
      const style2Btn = $('style2');
      
      if (styleNum === 1) {
        style1Btn.classList.add('bg-neutralDark', 'text-white');
        style1Btn.classList.remove('bg-gray-200', 'text-gray-700');
        style2Btn.classList.add('bg-gray-200', 'text-gray-700');
        style2Btn.classList.remove('bg-neutralDark', 'text-white');
      } else {
        style2Btn.classList.add('bg-neutralDark', 'text-white');
        style2Btn.classList.remove('bg-gray-200', 'text-gray-700');
        style1Btn.classList.add('bg-gray-200', 'text-gray-700');
        style1Btn.classList.remove('bg-neutralDark', 'text-white');
      }
      
      this.updatePreview();
      this.generateCode();
    }
    
    openAdvancedConfig() {
      // Create advanced configuration modal
      const modal = document.createElement('div');
      modal.id = 'advancedConfigModal';
      modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
      modal.innerHTML = `
        <div class="bg-white rounded-xl max-w-md w-full">
          <div class="p-6 border-b">
            <h3 class="text-lg font-semibold">Advanced Configuration</h3>
          </div>
          <div class="p-6 space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Background</label>
                <select id="configBackground" class="w-full px-3 py-2 border rounded-lg text-sm">
                  <option value="default">Default Theme</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="gradient">Gradient</option>
                  <option value="custom">Custom Color</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Border</label>
                <select id="configBorder" class="w-full px-3 py-2 border rounded-lg text-sm">
                  <option value="none">None</option>
                  <option value="thin">Thin</option>
                  <option value="thick">Thick</option>
                  <option value="rounded">Fully Rounded</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
              <input type="text" id="configButtonText" value="Add to Calendar" 
                     class="w-full px-3 py-2 border rounded-lg text-sm">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Icon</label>
              <select id="configIcon" class="w-full px-3 py-2 border rounded-lg text-sm">
                <option value="calendar">📅 Calendar</option>
                <option value="plus">➕ Plus</option>
                <option value="bookmark">🔖 Bookmark</option>
                <option value="none">No Icon</option>
              </select>
            </div>
          </div>
          <div class="p-4 border-t flex justify-end gap-2">
            <button id="configCancel" class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
              Cancel
            </button>
            <button id="configSave" class="px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover">
              Save
            </button>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      // Handle cancel
      $('configCancel').addEventListener('click', () => {
        document.body.removeChild(modal);
      });
      
      // Handle save
      $('configSave').addEventListener('click', () => {
        const background = $('configBackground').value;
        const border = $('configBorder').value;
        const text = $('configButtonText').value;
        const icon = $('configIcon').value;
        
        this.configuration = {
          ...this.configuration,
          color: background,
          style: border,
          customText: text,
          icon: icon
        };
        
        this.updatePreview();
        this.generateCode();
        document.body.removeChild(modal);
      });
      
      // Close on outside click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          document.body.removeChild(modal);
        }
      });
    }
    
    updatePreview() {
      // Update event preview card
      if (eventTitle.value) {
        previewTitle.textContent = eventTitle.value;
      }
      
      // Format date/time
      let dateTimeStr = '';
      if (startDate.value) {
        const startDt = new Date(startDate.value + 'T' + (startTime.value || '00:00'));
        const endDt = endDate.value ? new Date(endDate.value + 'T' + (endTime.value || '00:00')) : null;
        
        const dateOpts = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        const timeOpts = { hour: '2-digit', minute: '2-digit', hour12: true };
        
        dateTimeStr = startDt.toLocaleDateString('en-US', dateOpts);
        
        if (startTime.value) {
          dateTimeStr += ' • ' + startDt.toLocaleTimeString('en-US', timeOpts);
          if (endDate.value && endTime.value) {
            dateTimeStr += ' - ' + endDt.toLocaleTimeString('en-US', timeOpts);
          }
        }
      }
      
      previewDateTime.textContent = dateTimeStr || 'May 10, 2025 • 9:00am - 10:00am';
      previewTimezone.textContent = timezone.value.split('/')[1].replace('_', ' ') || 'GMT +03:00';
      
      // Update location and organizer
      previewLocation.textContent = locationInp.value || '123 Demo Street, Springfield';
      previewLocation.className = locationInp.value ? 'text-gray-600' : 'text-gray-500';
      
      const orgName = organizer.value || 'John Doe';
      const orgEmail = organizerEmail.value ? ` (${organizerEmail.value})` : '';
      previewOrganizer.textContent = `Organized by ${orgName}${orgEmail}`;
      previewOrganizer.className = organizer.value ? 'text-gray-600' : 'text-gray-500';
      
      // Update description
      const descValue = desc.value || '';
      if (descValue) {
        previewDescription.textContent = descValue;
        previewDescription.classList.remove('hidden');
      } else {
        previewDescription.classList.add('hidden');
      }
      
      // Update button/links preview
      this.updateOutputPreview();
    }
    
    updateOutputPreview() {
      const buttonPreview = $('buttonPreview').querySelector('button');
      const linksContainer = $('linksPreview').querySelector('.flex');
      
      if (this.isButtonFormat) {
        // Update button style based on configuration
        let buttonClasses = 'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition';
        let bgColor = '#333333';
        let textColor = '#FFFFFF';
        
        if (this.currentStyle === 1) {
          buttonClasses += ' bg-neutralDark text-white';
        } else if (this.currentStyle === 2) {
          buttonClasses += ' bg-white border border-gray-300 text-gray-700';
        }
        
        buttonPreview.className = buttonClasses;
        buttonPreview.innerHTML = `
          <span class="text-base">${this.getIconForButton()}</span>
          ${this.configuration.customText || 'Add to Calendar'}
        `;
      } else {
        // Update links based on selected platforms
        linksContainer.innerHTML = '';
        
        this.selectedPlatforms.forEach(platform => {
          const link = this.createPlatformLink(platform);
          linksContainer.appendChild(link);
        });
      }
    }
    
    getIconForButton() {
      switch (this.configuration.icon) {
        case 'plus': return '➕';
        case 'bookmark': return '🔖';
        case 'none': return '';
        default: return '📅';
      }
    }
    
    createPlatformLink(platform) {
      const link = document.createElement('a');
      link.href = '#';
      
      const icons = {
        'apple': '🍎',
        'google': 'G',
        'outlook': '📧',
        'outlookcom': '◯',
        'office365': '📦',
        'yahoo': 'Y!'
      };
      
      const styles = {
        'apple': 'bg-black text-white',
        'google': 'bg-white border border-gray-200 text-gray-700',
        'outlook': 'bg-yellow-500 text-black',
        'outlookcom': 'bg-blue-600 text-white',
        'office365': 'bg-orange-500 text-white',
        'yahoo': 'bg-purple-600 text-white'
      };
      
      const names = {
        'apple': 'Apple',
        'google': 'Google',
        'outlook': 'Outlook',
        'outlookcom': 'Outlook.com',
        'office365': 'Office 365',
        'yahoo': 'Yahoo'
      };
      
      link.className = `inline-flex items-center gap-1 px-3 py-1 rounded text-xs ${styles[platform] || ''}`;
      link.innerHTML = `
        <span>${icons[platform] || ''}</span>
        ${names[platform] || platform}
      `;
      
      return link;
    }
    
    generateCode() {
      const eventData = this.getEventData();
      let code = '';
      
      if (this.isButtonFormat) {
        code = this.generateButtonCode(eventData);
      } else {
        code = this.generateLinksCode(eventData);
      }
      
      if (snippetCode) {
        snippetCode.textContent = code;
      }
    }
    
    getEventData() {
      return {
        title: eventTitle.value || 'Product launch webinar',
        startDate: startDate.value || '2025-05-10',
        startTime: startTime.value || '09:00',
        endDate: endDate.value || '',
        endTime: endTime.value || '',
        timezone: timezone.value || 'Asia/Istanbul',
        location: locationInp.value || '123 Demo Street, Springfield',
        description: desc.value || '',
        organizer: organizer.value || 'John Doe',
        organizerEmail: organizerEmail.value || ''
      };
    }
    
    generateButtonCode(eventData) {
      // Generate unique ID for this calendar event
      const eventId = 'event_' + Date.now();
      
      // Generate the calendar links for each platform
      const links = {};
      this.selectedPlatforms.forEach(platform => {
        links[platform] = this.generateCalendarLink(platform, eventData);
      });
      
      // Create the button HTML
      let buttonCode = `<div id="${eventId}" style="font-family: Nunito, sans-serif;">
  <button class="easycal-button" style="`;
      
      // Apply button styles
      if (this.currentStyle === 1) {
        buttonCode += `background: #333333; color: #FFFFFF; border: none;`;
      } else if (this.currentStyle === 2) {
        buttonCode += `background: #FFFFFF; color: #333333; border: 1px solid #D1D5DB;`;
      }
      
      buttonCode += `padding: 8px 16px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: all 0.15s;">
    <span style="font-size: 16px;">${this.getIconForButton()}</span>
    ${this.configuration.customText || 'Add to Calendar'}
  </button>
  <div id="${eventId}_dropdown" class="easycal-dropdown" style="display: none; position: absolute; background: white; border: 1px solid #E5E7EB; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 1000; min-width: 200px;">`;
      
      // Add platform links
      this.selectedPlatforms.forEach(platform => {
        const icon = {
          'apple': '🍎',
          'google': '📅',
          'outlook': '📧',
          'outlookcom': '◯',
          'office365': '📦',
          'yahoo': 'Y!'
        }[platform] || '';
        
        const name = {
          'apple': 'Apple Calendar',
          'google': 'Google Calendar',
          'outlook': 'Outlook',
          'outlookcom': 'Outlook.com',
          'office365': 'Office 365',
          'yahoo': 'Yahoo Calendar'
        }[platform] || platform;
        
        buttonCode += `
    <a href="${links[platform]}" target="_blank" style="display: flex; align-items: center; gap: 8px; padding: 8px 12px; text-decoration: none; color: #333; transition: background 0.15s;" onmouseover="this.style.background='#F3F4F6'" onmouseout="this.style.background='transparent'">
      <span style="font-size: 16px;">${icon}</span>
      <span style="font-size: 14px;">${name}</span>
    </a>`;
      });
      
      buttonCode += `
  </div>
</div>

<style>
  .easycal-button:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  .easycal-button:active {
    transform: scale(0.98);
  }
</style>

<script>
  document.getElementById('${eventId}').onclick = function(e) {
    e.stopPropagation();
    var dropdown = document.getElementById('${eventId}_dropdown');
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
  };
  
  document.addEventListener('click', function() {
    var dropdown = document.getElementById('${eventId}_dropdown');
    if (dropdown) dropdown.style.display = 'none';
  });
</script>`;
      
      return buttonCode;
    }
    
    generateLinksCode(eventData) {
      let linksCode = `<!-- Add to Calendar Links -->
<p>Add event to calendar:</p>
<div style="display: flex; gap: 8px; flex-wrap: wrap; font-family: Nunito, sans-serif;">`;
      
      this.selectedPlatforms.forEach(platform => {
        const url = this.generateCalendarLink(platform, eventData);
        const icon = {
          'apple': '🍎',
          'google': '📅',
          'outlook': '📧',
          'outlookcom': '◯',
          'office365': '📦',
          'yahoo': 'Y!'
        }[platform] || '';
        
        const name = {
          'apple': 'Apple',
          'google': 'Google',
          'outlook': 'Outlook',
          'outlookcom': 'Outlook.com',
          'office365': 'Office 365',
          'yahoo': 'Yahoo'
        }[platform] || platform;
        
        const styles = {
          'apple': 'background: #000; color: #fff;',
          'google': 'background: #fff; border: 1px solid #e5e7eb; color: #333;',
          'outlook': 'background: #eab308; color: #000;',
          'outlookcom': 'background: #2563eb; color: #fff;',
          'office365': 'background: #ea580c; color: #fff;',
          'yahoo': 'background: #9333ea; color: #fff;'
        }[platform] || '';
        
        linksCode += `
  <a href="${url}" target="_blank" style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 12px; border-radius: 4px; text-decoration: none; ${styles} font-size: 12px;">
    <span>${icon}</span> ${name}
  </a>`;
      });
      
      linksCode += `
</div>`;
      
      return linksCode;
    }
    
    generateCalendarLink(platform, eventData) {
      const startDateTime = new Date(`${eventData.startDate}T${eventData.startTime || '00:00'}`);
      const endDateTime = eventData.endDate ? new Date(`${eventData.endDate}T${eventData.endTime || '00:00'}`) : new Date(startDateTime.getTime() + 60 * 60 * 1000);
      
      const formatDate = (date) => {
        return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
      };
      
      const formatDateForOutlook = (date) => {
        return date.toISOString().replace(/\.\d{3}Z$/, '');
      };
      
      const encodeParam = (str) => {
        return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
          return '%' + c.charCodeAt(0).toString(16);
        });
      };
      
      switch (platform) {
        case 'google':
          const googleStart = formatDate(startDateTime);
          const googleEnd = formatDate(endDateTime);
          const googleTitle = encodeParam(eventData.title);
          const googleDetails = encodeParam(eventData.description);
          const googleLocation = encodeParam(eventData.location);
          
          return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${googleTitle}&dates=${googleStart}/${googleEnd}&details=${googleDetails}&location=${googleLocation}`;
          
        case 'outlook':
          const outlookStart = formatDateForOutlook(startDateTime);
          const outlookEnd = formatDateForOutlook(endDateTime);
          const outlookParams = new URLSearchParams({
            path: '/calendar/action/compose',
            subject: eventData.title,
            startdt: outlookStart,
            enddt: outlookEnd,
            body: eventData.description,
            location: eventData.location
          });
          
          return `https://outlook.live.com/calendar/0/deeplink/compose?${outlookParams}`;
          
        case 'outlookcom':
          const outlookComParams = new URLSearchParams({
            subject: eventData.title,
            startdt: formatDateForOutlook(startDateTime),
            enddt: formatDateForOutlook(endDateTime),
            body: eventData.description,
            location: eventData.location
          });
          
          return `https://outlook.office.com/calendar/0/deeplink/compose?${outlookComParams}`;
          
        case 'office365':
          const office365Params = new URLSearchParams({
            subject: eventData.title,
            startdt: formatDateForOutlook(startDateTime),
            enddt: formatDateForOutlook(endDateTime),
            body: eventData.description,
            location: eventData.location
          });
          
          return `https://outlook.office365.com/calendar/0/deeplink/compose?${office365Params}`;
          
        case 'yahoo':
          const yahooStart = startDateTime.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, '');
          const yahooEnd = endDateTime.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, '');
          const yahooParams = new URLSearchParams({
            v: '60',
            title: eventData.title,
            st: yahooStart,
            et: yahooEnd,
            desc: eventData.description,
            in_loc: eventData.location
          });
          
          return `https://calendar.yahoo.com/?${yahooParams}`;
          
        case 'apple':
          // Apple Calendar uses ICS file format
          const icsContent = this.generateICSFile(eventData);
          const blob = new Blob([icsContent], { type: 'text/calendar' });
          return URL.createObjectURL(blob);
          
        default:
          return '#';
      }
    }
    
    generateICSFile(eventData) {
      const startDateTime = new Date(`${eventData.startDate}T${eventData.startTime || '00:00'}`);
      const endDateTime = eventData.endDate ? new Date(`${eventData.endDate}T${eventData.endTime || '00:00'}`) : new Date(startDateTime.getTime() + 60 * 60 * 1000);
      
      const formatICSDate = (date) => {
        return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
      };
      
      let ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//EasyCal//Calendar//EN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${Date.now()}@easycal.com
DTSTART:${formatICSDate(startDateTime)}
DTEND:${formatICSDate(endDateTime)}
SUMMARY:${eventData.title.replace(/\n/g, '\\n')}
DESCRIPTION:${eventData.description.replace(/\n/g, '\\n')}
LOCATION:${eventData.location.replace(/\n/g, '\\n')}`;
      
      if (eventData.organizer) {
        ics += `\nORGANIZER:CN=${eventData.organizer}:MAILTO:${eventData.organizerEmail || 'organizer@example.com'}`;
      }
      
      ics += `\nEND:VEVENT
END:VCALENDAR`;
      
      return ics;
    }
  }

  /* === Copy Functionality === */
  class CopyManager {
    constructor() {
      this.copyButton = $('copyButton');
      this.mainCopyButton = $('mainCopyButton');
      this.init();
    }
    
    init() {
      [this.copyButton, this.mainCopyButton].forEach(button => {
        if (button) {
          button.addEventListener('click', () => this.copyCode());
        }
      });
    }
    
    async copyCode() {
      const code = snippetCode?.textContent || '';
      
      try {
        await navigator.clipboard.writeText(code);
        this.showSuccessToast();
      } catch (err) {
        console.error('Failed to copy:', err);
        // Fallback for older browsers
        this.fallbackCopy(code);
      }
    }
    
    fallbackCopy(text) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        this.showSuccessToast();
      } catch (err) {
        console.error('Fallback copy failed:', err);
      }
      
      document.body.removeChild(textArea);
    }
    
    showSuccessToast() {
      if (toast) {
        toast.classList.add('show');
        setTimeout(() => {
          toast.classList.remove('show');
        }, 2000);
      }
    }
  }

  /* === Sharing Features === */
  class ShareManager {
    constructor() {
      this.shareButton = $('shareButton');
      this.shareDropdown = $('shareDropdown');
      this.init();
    }
    
    init() {
      if (this.shareButton) {
        this.shareButton.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleDropdown();
        });
      }
      
      document.addEventListener('click', () => {
        this.closeDropdown();
      });
      
      // Add share options
      if (this.shareDropdown) {
        this.setupShareOptions();
      }
    }
    
    toggleDropdown() {
      if (this.shareDropdown) {
        this.shareDropdown.classList.toggle('hidden');
      }
    }
    
    closeDropdown() {
      if (this.shareDropdown) {
        this.shareDropdown.classList.add('hidden');
      }
    }
    
    setupShareOptions() {
      const options = this.shareDropdown.querySelectorAll('button');
      
      options[0]?.addEventListener('click', () => this.shareViaEmail());
      options[1]?.addEventListener('click', () => this.copyLink());
      options[2]?.addEventListener('click', () => this.downloadQRCode());
    }
    
    shareViaEmail() {
      const eventData = this.getEventData();
      const subject = `Add to Calendar: ${eventData.title}`;
      const body = `Hi,\n\nYou're invited to add this event to your calendar:\n\n${eventData.title}\n${eventData.startDate} at ${eventData.startTime}\n${eventData.location}\n\nAdd to your calendar: ${this.getShareableLink()}`;
      
      window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    }
    
    async copyLink() {
      const link = this.getShareableLink();
      try {
        await navigator.clipboard.writeText(link);
        // Show success message
        console.log('Link copied to clipboard');
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
    
    downloadQRCode() {
      // Generate QR code for the shareable link
      const link = this.getShareableLink();
      // In a real implementation, you'd use a QR code library here
      console.log('Generate QR code for:', link);
    }
    
    getShareableLink() {
      // In a real implementation, this would generate a shareable link
      // For now, we'll return a placeholder
      return 'https://easycal.com/event/12345';
    }
    
    getEventData() {
      return {
        title: eventTitle.value || 'Product launch webinar',
        startDate: startDate.value || '2025-05-10',
        startTime: startTime.value || '09:00',
        location: locationInp.value || '123 Demo Street, Springfield'
      };
    }
  }

  /* === Form Management === */
  class FormManager {
    constructor() {
      this.createButton = createButton;
      this.cancelButton = cancelButton;
      this.init();
    }
    
    init() {
      if (this.createButton) {
        this.createButton.addEventListener('click', () => this.createEvent());
      }
      
      if (this.cancelButton) {
        this.cancelButton.addEventListener('click', () => this.resetForm());
      }
      
      // Initialize preview updates
      this.setupPreviewUpdates();
    }
    
    createEvent() {
      // Validate form
      if (!this.validateForm()) {
        this.showValidationErrors();
        return;
      }
      
      // Generate code
      preview.generateCode();
      
      // Scroll to preview or show success message
      this.showCreateSuccess();
    }
    
    resetForm() {
      // Reset all form fields
      eventTitle.value = '';
      startDate.value = '';
      startTime.value = '';
      endDate.value = '';
      endTime.value = '';
      timezone.selectedIndex = 0;
      locationInp.value = '';
      document.getElementById('smartEditor').innerHTML = '';
      desc.value = '';
      organizer.value = '';
      organizerEmail.value = '';
      
      // Reset checkboxes
      document.querySelectorAll('[type="checkbox"]').forEach(cb => {
        cb.checked = false;
      });
      
      // Reset platform selections
      document.querySelectorAll('[id^="plt"]').forEach(cb => {
        cb.checked = true;
      });
      
      // Update preview
      updatePreview();
    }
    
    validateForm() {
      // Basic validation - require at least title and start date
      return eventTitle.value.trim() !== '' && startDate.value !== '';
    }
    
    showValidationErrors() {
      // You could add validation error messages here
      console.log('Please fill in required fields');
    }
    
    showCreateSuccess() {
      // Scroll to preview section
      document.querySelector('.col-span-12.lg:col-span-5').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
    
    setupPreviewUpdates() {
      // Update preview on any input change
      [eventTitle, startDate, startTime, endDate, endTime, timezone, locationInp, organizer, organizerEmail]
        .forEach(input => {
          if (input) {
            input.addEventListener('input', updatePreview);
          }
        });
      
      // Special handling for description editor
      const editor = document.getElementById('smartEditor');
      if (editor) {
        editor.addEventListener('input', () => {
          desc.value = editor.innerText;
          updatePreview();
        });
      }
    }
  }

  /* === Global Preview Update Function === */
  function updatePreview() {
    if (preview) {
      preview.updatePreview();
    }
  }

  /* === Auto-fill Demo Data === */
  function autoFillDemoData() {
    // Set some default values for demo purposes
    eventTitle.value = 'Product launch webinar';
    startDate.value = '2025-05-10';
    startTime.value = '09:00';
    endDate.value = '2025-05-10';
    endTime.value = '10:00';
    timezone.value = 'Asia/Istanbul';
    locationInp.value = '123 Demo Street, Springfield';
    organizer.value = 'John Doe';
    organizerEmail.value = 'john@example.com';
    
    // Set a sample description
    const editor = document.getElementById('smartEditor');
    if (editor) {
      editor.innerHTML = 'Join us for an exciting product launch webinar where we\'ll showcase our latest innovations.';
    }
    
    // Update preview
    updatePreview();
  }

  /* === Initialize Everything === */
  const smartEditor = new SmartDescriptionEditor();
  const preview = new EnhancedPreview();
  const copyManager = new CopyManager();
  const shareManager = new ShareManager();
  const formManager = new FormManager();
  
  // Auto-fill demo data for initial state
  autoFillDemoData();
});