/**
 * EasyCal - Calendar Button Generator
 * A tool to create "Add to Calendar" buttons for events
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize the application
  const app = new EasyCalApp();
  app.init();
});

/**
 * Main application class
 */
class EasyCalApp {
  constructor() {
    // DOM element references
    this.elements = {};
    
    // Application state
    this.state = {
      buttonStyle: 'dark',
      outputFormat: 'button',
      buttonColor: '#333333',
      platforms: {
        apple: true,
        google: true,
        outlook: true,
        outlookCom: true,
        office365: true,
        yahoo: true
      },
      showTimezone: false
    };
    
    // Initialize managers
    this.formManager = new FormManager(this);
    this.previewManager = new PreviewManager(this);
    this.codeGenerator = new CodeGenerator(this);
    this.copyManager = new CopyManager(this);
    this.editorManager = new EditorManager(this);
    this.uiManager = new UIManager(this);
  }
  
  /**
   * Initialize the application
   */
  init() {
    this.cacheElements();
    this.bindEvents();
    this.initializeValues();
    
    // Initialize managers
    this.formManager.init();
    this.previewManager.init();
    this.codeGenerator.init();
    this.copyManager.init();
    this.editorManager.init();
    this.uiManager.init();
    
    console.log('EasyCal initialized successfully');
  }
  
  /**
   * Cache DOM elements for better performance
   */
  cacheElements() {
    // Helper function to get elements by ID
    const $ = (id) => {
      const element = document.getElementById(id);
      if (!element) {
        console.warn(`Element with id "${id}" not found`);
      }
      return element;
    };
    
    // Form elements
    this.elements.eventTitle = $('eventTitle');
    this.elements.startDate = $('startDate');
    this.elements.startTime = $('startTime');
    this.elements.startHour = $('startHour');
    this.elements.startMinute = $('startMinute');
    this.elements.startAmPm = $('startAmPm');
    this.elements.endDate = $('endDate');
    this.elements.endTime = $('endTime');
    this.elements.endHour = $('endHour');
    this.elements.endMinute = $('endMinute');
    this.elements.endAmPm = $('endAmPm');
    this.elements.timezone = $('timezone');
    this.elements.location = $('location');
    this.elements.description = $('description');
    this.elements.smartEditor = $('smartEditor');
    this.elements.organizer = $('organizer');
    this.elements.organizerEmail = $('organizerEmail');
    this.elements.allDay = $('allDay');
    this.elements.recurring = $('recurring');
    this.elements.rsvp = $('rsvp');
    
    // Preview elements
    this.elements.previewTitle = $('previewTitle');
    this.elements.previewDateTime = $('previewDateTime');
    this.elements.previewTimezone = $('previewTimezone');
    this.elements.previewLocation = $('previewLocation');
    this.elements.previewOrganizer = $('previewOrganizer');
    this.elements.previewDescription = $('previewDescription');
    
    // Button elements
    this.elements.buttonFormat = $('buttonFormat');
    this.elements.linksFormat = $('linksFormat');
    this.elements.buttonPreview = $('buttonPreview');
    this.elements.linksPreview = $('linksPreview');
    this.elements.style1 = $('style1');
    this.elements.style2 = $('style2');
    this.elements.colorPicker = $('colorPicker');
    this.elements.colorPickerPanel = $('colorPickerPanel');
    
    // Platform checkboxes
    this.elements.pltApple = $('pltApple');
    this.elements.pltGoogle = $('pltGoogle');
    this.elements.pltOutlook = $('pltOutlook');
    this.elements.pltOutlookCom = $('pltOutlookCom');
    this.elements.pltOffice365 = $('pltOffice365');
    this.elements.pltYahoo = $('pltYahoo');
    
    // Action buttons
    this.elements.copyButton = $('copyButton');
    this.elements.mainCopyButton = $('mainCopyButton');
    this.elements.createButton = $('createButton');
    this.elements.cancelButton = $('cancelButton');
    this.elements.saveButton = $('saveButton');
    this.elements.shareButton = $('shareButton');
    this.elements.shareDropdown = $('shareDropdown');
    
    // Other elements
    this.elements.snippetCode = $('snippetCode');
    this.elements.copySuccess = $('copySuccess');
    this.elements.showTimezone = $('showTimezone');
    this.elements.timezoneSection = $('timezoneSection');
    this.elements.smartToolbar = $('smartToolbar');
  }
  
  /**
   * Bind event listeners
   */
  bindEvents() {
    // Form input events
    this.elements.eventTitle.addEventListener('input', () => this.updatePreview());
    this.elements.startDate.addEventListener('change', () => this.updatePreview());
    this.elements.startHour.addEventListener('change', () => this.updateTimeFromSelects('start'));
    this.elements.startMinute.addEventListener('change', () => this.updateTimeFromSelects('start'));
    this.elements.startAmPm.addEventListener('change', () => this.updateTimeFromSelects('start'));
    this.elements.endDate.addEventListener('change', () => this.updatePreview());
    this.elements.endHour.addEventListener('change', () => this.updateTimeFromSelects('end'));
    this.elements.endMinute.addEventListener('change', () => this.updateTimeFromSelects('end'));
    this.elements.endAmPm.addEventListener('change', () => this.updateTimeFromSelects('end'));
    this.elements.timezone.addEventListener('change', () => this.updatePreview());
    this.elements.location.addEventListener('input', () => this.updatePreview());
    this.elements.organizer.addEventListener('input', () => this.updatePreview());
    this.elements.organizerEmail.addEventListener('input', () => this.updatePreview());
    this.elements.allDay.addEventListener('change', () => this.formManager.handleAllDayToggle());
    this.elements.recurring.addEventListener('change', () => this.updatePreview());
    this.elements.rsvp.addEventListener('change', () => this.updatePreview());
    
    // Button format toggle
    this.elements.buttonFormat.addEventListener('click', () => this.uiManager.setOutputFormat('button'));
    this.elements.linksFormat.addEventListener('click', () => this.uiManager.setOutputFormat('links'));
    
    // Button style toggle
    this.elements.style1.addEventListener('click', () => this.uiManager.setButtonStyle('dark'));
    this.elements.style2.addEventListener('click', () => this.uiManager.setButtonStyle('light'));
    this.elements.colorPicker.addEventListener('click', () => this.uiManager.toggleColorPicker());
    
    // Platform checkboxes
    this.elements.pltApple.addEventListener('change', () => this.updatePlatformState('apple'));
    this.elements.pltGoogle.addEventListener('change', () => this.updatePlatformState('google'));
    this.elements.pltOutlook.addEventListener('change', () => this.updatePlatformState('outlook'));
    this.elements.pltOutlookCom.addEventListener('change', () => this.updatePlatformState('outlookCom'));
    this.elements.pltOffice365.addEventListener('change', () => this.updatePlatformState('office365'));
    this.elements.pltYahoo.addEventListener('change', () => this.updatePlatformState('yahoo'));
    
    // Action buttons
    this.elements.copyButton.addEventListener('click', () => this.copyManager.copyCode());
    this.elements.mainCopyButton.addEventListener('click', () => this.copyManager.copyCode());
    this.elements.createButton.addEventListener('click', () => this.formManager.handleCreate());
    this.elements.cancelButton.addEventListener('click', () => this.formManager.handleCancel());
    this.elements.saveButton.addEventListener('click', () => this.formManager.handleSave());
    this.elements.shareButton.addEventListener('click', () => this.uiManager.toggleShareDropdown());
    
    // Timezone toggle
    this.elements.showTimezone.addEventListener('click', () => this.uiManager.toggleTimezoneSection());
    
    // Color picker panel
    if (this.elements.colorPickerPanel) {
      const colorButtons = this.elements.colorPickerPanel.querySelectorAll('button');
      colorButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          const color = e.currentTarget.dataset.color;
          if (color === 'custom') {
            this.uiManager.showCustomColorPicker();
          } else {
            this.uiManager.setButtonColor(color);
          }
        });
      });
    }
    
    // Document click handler for closing dropdowns
    document.addEventListener('click', (e) => {
      // Close share dropdown when clicking outside
      if (this.elements.shareDropdown && 
          this.elements.shareDropdown.classList.contains('block') && 
          !this.elements.shareButton.contains(e.target) && 
          !this.elements.shareDropdown.contains(e.target)) {
        this.uiManager.toggleShareDropdown(false);
      }
      
      // Close color picker when clicking outside
      if (this.elements.colorPickerPanel && 
          !this.elements.colorPickerPanel.classList.contains('hidden') && 
          !this.elements.colorPicker.contains(e.target) && 
          !this.elements.colorPickerPanel.contains(e.target)) {
        this.uiManager.toggleColorPicker(false);
      }
    });
  }
  
  /**
   * Initialize form values with defaults
   */
  initializeValues() {
    // Set default dates to today
    const today = new Date();
    const formattedDate = this.formatDate(today);
    
    if (this.elements.startDate) {
      this.elements.startDate.value = formattedDate;
    }
    
    if (this.elements.endDate) {
      this.elements.endDate.value = formattedDate;
    }
    
    // Set default times (rounded to next 15 min for start, +1 hour for end)
    if (this.elements.startTime && this.elements.endTime) {
      const roundedStartTime = this.getRoundedTime(today);
      const endTime = new Date(today);
      endTime.setHours(endTime.getHours() + 1);
      endTime.setMinutes(roundedStartTime.getMinutes());
      
      this.elements.startTime.value = this.formatTime(roundedStartTime);
      this.elements.endTime.value = this.formatTime(endTime);
      
      // Set the hour, minute, and AM/PM selects
      this.updateTimeSelects('start', roundedStartTime);
      this.updateTimeSelects('end', endTime);
    }
    
    // Set default timezone based on browser
    if (this.elements.timezone) {
      try {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (timeZone && this.elements.timezone.querySelector(`option[value="${timeZone}"]`)) {
          this.elements.timezone.value = timeZone;
        }
      } catch (e) {
        console.warn('Could not detect timezone:', e);
      }
    }
    
    // Initialize demo data for better user experience
    this.setDemoData();
    
    // Update preview with initial values
    this.updatePreview();
  }
  
  /**
   * Set demo data for the form
   */
  setDemoData() {
    if (this.elements.eventTitle) {
      this.elements.eventTitle.value = 'Product launch webinar';
    }
    
    if (this.elements.location) {
      this.elements.location.value = '123 Demo Street, Springfield';
    }
    
    if (this.elements.smartEditor) {
      this.elements.smartEditor.innerHTML = 'Join us for an exciting product launch webinar where we\'ll showcase our latest innovations.';
      if (this.elements.description) {
        this.elements.description.value = this.elements.smartEditor.innerHTML;
      }
    }
    
    if (this.elements.organizer) {
      this.elements.organizer.value = 'John Doe';
    }
    
    if (this.elements.organizerEmail) {
      this.elements.organizerEmail.value = 'john@example.com';
    }
  }
  
  /**
   * Update the preview with current form values
   */
  updatePreview() {
    this.previewManager.updatePreview();
    this.codeGenerator.updateCode();
  }
  
  /**
   * Update platform state when checkboxes change
   */
  updatePlatformState(platform) {
    const checkbox = this.elements[`plt${platform.charAt(0).toUpperCase() + platform.slice(1)}`];
    if (checkbox) {
      this.state.platforms[platform] = checkbox.checked;
      this.updatePreview();
    }
  }
  
  /**
   * Format a date object to YYYY-MM-DD for input fields
   */
  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  /**
   * Format a time object to HH:MM for input fields
   */
  formatTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  
  /**
   * Round time to nearest 30 minutes
   */
  getRoundedTime(date) {
    const roundedDate = new Date(date);
    const minutes = date.getMinutes();
    const remainder = minutes % 30;
    
    if (remainder === 0) {
      // Already at a 30-minute mark, add 30 minutes
      roundedDate.setMinutes(minutes + 30);
    } else {
      // Round up to next 30-minute mark
      roundedDate.setMinutes(minutes + (30 - remainder));
    }
    
    // Reset seconds and milliseconds
    roundedDate.setSeconds(0);
    roundedDate.setMilliseconds(0);
    
    return roundedDate;
  }
  
  /**
   * Format a date and time for display
   */
  formatDateTimeForDisplay(dateStr, timeStr) {
    if (!dateStr || !timeStr) return '';
    
    try {
      const date = new Date(`${dateStr}T${timeStr}`);
      
      // Format the time in 12-hour format
      let hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // Convert 0 to 12
      
      return `${hours}:${minutes} ${ampm}`;
    } catch (e) {
      console.error('Error formatting date/time:', e);
      return '';
    }
  }
  
  /**
   * Update time selects based on 24-hour time value
   */
  updateTimeSelects(type, date) {
    const hour = date.getHours();
    const minute = date.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12; // Convert 0 to 12
    
    // Round minute to nearest 15
    const roundedMinute = Math.round(minute / 15) * 15;
    const minuteStr = roundedMinute === 60 ? '00' : String(roundedMinute).padStart(2, '0');
    
    if (type === 'start') {
      this.elements.startHour.value = hour12;
      this.elements.startMinute.value = minuteStr;
      this.elements.startAmPm.value = ampm;
    } else {
      this.elements.endHour.value = hour12;
      this.elements.endMinute.value = minuteStr;
      this.elements.endAmPm.value = ampm;
    }
  }
  
  /**
   * Update hidden time input from hour, minute, and AM/PM selects
   */
  updateTimeFromSelects(type) {
    if (type === 'start') {
      const hour = parseInt(this.elements.startHour.value);
      const minute = parseInt(this.elements.startMinute.value);
      const ampm = this.elements.startAmPm.value;
      
      // Convert to 24-hour format
      let hour24 = hour;
      if (ampm === 'PM' && hour < 12) {
        hour24 += 12;
      } else if (ampm === 'AM' && hour === 12) {
        hour24 = 0;
      }
      
      // Update hidden input
      this.elements.startTime.value = `${String(hour24).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    } else {
      const hour = parseInt(this.elements.endHour.value);
      const minute = parseInt(this.elements.endMinute.value);
      const ampm = this.elements.endAmPm.value;
      
      // Convert to 24-hour format
      let hour24 = hour;
      if (ampm === 'PM' && hour < 12) {
        hour24 += 12;
      } else if (ampm === 'AM' && hour === 12) {
        hour24 = 0;
      }
      
      // Update hidden input
      this.elements.endTime.value = `${String(hour24).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    }
    
    // Update preview
    this.updatePreview();
  }
  
  /**
   * Get event data from form
   */
  getEventData() {
    return {
      title: this.elements.eventTitle ? this.elements.eventTitle.value : '',
      startDate: this.elements.startDate ? this.elements.startDate.value : '',
      startTime: this.elements.startTime ? this.elements.startTime.value : '',
      endDate: this.elements.endDate ? this.elements.endDate.value : '',
      endTime: this.elements.endTime ? this.elements.endTime.value : '',
      timezone: this.elements.timezone ? this.elements.timezone.value : '',
      location: this.elements.location ? this.elements.location.value : '',
      description: this.elements.description ? this.elements.description.value : 
                  (this.elements.smartEditor ? this.elements.smartEditor.innerHTML : ''),
      organizer: this.elements.organizer ? this.elements.organizer.value : '',
      organizerEmail: this.elements.organizerEmail ? this.elements.organizerEmail.value : '',
      allDay: this.elements.allDay ? this.elements.allDay.checked : false,
      recurring: this.elements.recurring ? this.elements.recurring.checked : false,
      rsvp: this.elements.rsvp ? this.elements.rsvp.checked : false
    };
  }
}

/**
 * Manages form interactions and validation
 */
class FormManager {
  constructor(app) {
    this.app = app;
  }
  
  init() {
    // Initialize form validation
    this.setupFormValidation();
  }
  
  /**
   * Set up form validation
   */
  setupFormValidation() {
    // Add validation classes to required fields
    const requiredFields = [
      this.app.elements.eventTitle,
      this.app.elements.startDate,
      this.app.elements.endDate
    ];
    
    requiredFields.forEach(field => {
      if (field) {
        field.addEventListener('blur', () => {
          this.validateField(field);
        });
      }
    });
    
    // Validate email format
    if (this.app.elements.organizerEmail) {
      this.app.elements.organizerEmail.addEventListener('blur', () => {
        this.validateEmail(this.app.elements.organizerEmail);
      });
    }
  }
  
  /**
   * Validate a required field
   */
  validateField(field) {
    if (!field.value.trim()) {
      field.classList.add('border-error');
      return false;
    } else {
      field.classList.remove('border-error');
      return true;
    }
  }
  
  /**
   * Validate email format
   */
  validateEmail(field) {
    if (field.value.trim() === '') {
      // Empty email is allowed
      field.classList.remove('border-error');
      return true;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(field.value)) {
      field.classList.add('border-error');
      return false;
    } else {
      field.classList.remove('border-error');
      return true;
    }
  }
  
  /**
   * Validate the entire form
   */
  validateForm() {
    let isValid = true;
    
    // Validate required fields
    isValid = this.validateField(this.app.elements.eventTitle) && isValid;
    isValid = this.validateField(this.app.elements.startDate) && isValid;
    isValid = this.validateField(this.app.elements.endDate) && isValid;
    
    // Validate email if provided
    if (this.app.elements.organizerEmail.value.trim() !== '') {
      isValid = this.validateEmail(this.app.elements.organizerEmail) && isValid;
    }
    
    // Validate date logic (end date/time must be after start date/time)
    const startDateTime = new Date(`${this.app.elements.startDate.value}T${this.app.elements.startTime.value}`);
    const endDateTime = new Date(`${this.app.elements.endDate.value}T${this.app.elements.endTime.value}`);
    
    if (endDateTime <= startDateTime) {
      this.app.elements.endDate.classList.add('border-error');
      this.app.elements.endTime.classList.add('border-error');
      isValid = false;
    } else {
      this.app.elements.endDate.classList.remove('border-error');
      this.app.elements.endTime.classList.remove('border-error');
    }
    
    return isValid;
  }
  
  /**
   * Handle all-day event toggle
   */
  handleAllDayToggle() {
    const isAllDay = this.app.elements.allDay.checked;
    
    if (isAllDay) {
      // Disable time inputs
      this.app.elements.startHour.disabled = true;
      this.app.elements.startMinute.disabled = true;
      this.app.elements.startAmPm.disabled = true;
      this.app.elements.endHour.disabled = true;
      this.app.elements.endMinute.disabled = true;
      this.app.elements.endAmPm.disabled = true;
      
      // Store current times
      this.app.elements.startTime.dataset.prevValue = this.app.elements.startTime.value;
      this.app.elements.endTime.dataset.prevValue = this.app.elements.endTime.value;
      
      // Set times to full day
      this.app.elements.startTime.value = '00:00';
      this.app.elements.endTime.value = '23:59';
      
      // Update selects
      this.app.updateTimeSelects('start', new Date(`2023-01-01T00:00:00`));
      this.app.updateTimeSelects('end', new Date(`2023-01-01T23:59:00`));
    } else {
      // Re-enable time inputs
      this.app.elements.startHour.disabled = false;
      this.app.elements.startMinute.disabled = false;
      this.app.elements.startAmPm.disabled = false;
      this.app.elements.endHour.disabled = false;
      this.app.elements.endMinute.disabled = false;
      this.app.elements.endAmPm.disabled = false;
      
      // Restore previous times if available
      if (this.app.elements.startTime.dataset.prevValue) {
        this.app.elements.startTime.value = this.app.elements.startTime.dataset.prevValue;
        const [hours, minutes] = this.app.elements.startTime.dataset.prevValue.split(':');
        this.app.updateTimeSelects('start', new Date(`2023-01-01T${hours}:${minutes}:00`));
      }
      
      if (this.app.elements.endTime.dataset.prevValue) {
        this.app.elements.endTime.value = this.app.elements.endTime.dataset.prevValue;
        const [hours, minutes] = this.app.elements.endTime.dataset.prevValue.split(':');
        this.app.updateTimeSelects('end', new Date(`2023-01-01T${hours}:${minutes}:00`));
      }
    }
    
    this.app.updatePreview();
  }
  
  /**
   * Handle create button click
   */
  handleCreate() {
    if (this.validateForm()) {
      // Generate the final code
      this.app.codeGenerator.updateCode();
      
      // Show success message or perform additional actions
      this.showSuccessMessage('Event created successfully!');
    }
  }
  
  /**
   * Handle cancel button click
   */
  handleCancel() {
    // Reset form to default values
    this.resetForm();
  }
  
  /**
   * Handle save button click
   */
  handleSave() {
    if (this.validateForm()) {
      // Save event data (could be to localStorage or server)
      const eventData = this.app.getEventData();
      localStorage.setItem('easycal_saved_event', JSON.stringify(eventData));
      
      this.showSuccessMessage('Event saved successfully!');
    }
  }
  
  /**
   * Reset form to default values
   */
  resetForm() {
    // Clear form fields
    this.app.elements.eventTitle.value = '';
    this.app.elements.location.value = '';
    this.app.elements.smartEditor.innerHTML = '';
    this.app.elements.description.value = '';
    this.app.elements.organizer.value = '';
    this.app.elements.organizerEmail.value = '';
    
    // Reset checkboxes
    this.app.elements.allDay.checked = false;
    this.app.elements.recurring.checked = false;
    this.app.elements.rsvp.checked = false;
    
    // Reset date/time to defaults
    this.app.initializeValues();
    
    // Update preview
    this.app.updatePreview();
  }
  
  /**
   * Show a success message
   */
  showSuccessMessage(message) {
    // Could implement a toast or alert
    alert(message);
  }
}

/**
 * Manages the live preview
 */
class PreviewManager {
  constructor(app) {
    this.app = app;
  }
  
  init() {
    // Initial preview update
    this.updatePreview();
  }
  
  /**
   * Update the preview with current form values
   */
  updatePreview() {
    const eventData = this.app.getEventData();
    
    // Update title
    if (this.app.elements.previewTitle) {
      this.app.elements.previewTitle.textContent = eventData.title || 'Event Title';
    }
    
    // Update date/time
    if (this.app.elements.previewDateTime) {
      if (eventData.allDay) {
        this.app.elements.previewDateTime.textContent = 'All day';
      } else {
        const startTime = this.app.formatDateTimeForDisplay(eventData.startDate, eventData.startTime);
        const endTime = this.app.formatDateTimeForDisplay(eventData.endDate, eventData.endTime);
        this.app.elements.previewDateTime.textContent = `${startTime} - ${endTime}`;
      }
    }
    
    // Update timezone
    if (this.app.elements.previewTimezone) {
      if (eventData.timezone && this.app.elements.timezone) {
        const selectedOption = this.app.elements.timezone.options[this.app.elements.timezone.selectedIndex];
        this.app.elements.previewTimezone.textContent = selectedOption.text;
        this.app.elements.previewTimezone.classList.remove('hidden');
      } else {
        this.app.elements.previewTimezone.classList.add('hidden');
      }
    }
    
    // Update location
    if (this.app.elements.previewLocation) {
      if (eventData.location) {
        this.app.elements.previewLocation.textContent = eventData.location;
        this.app.elements.previewLocation.parentElement.classList.remove('hidden');
      } else {
        this.app.elements.previewLocation.parentElement.classList.add('hidden');
      }
    }
    
    // Update organizer
    if (this.app.elements.previewOrganizer) {
      if (eventData.organizer) {
        let organizerText = eventData.organizer;
        if (eventData.organizerEmail) {
          organizerText += ` (${eventData.organizerEmail})`;
        }
        this.app.elements.previewOrganizer.textContent = organizerText;
        this.app.elements.previewOrganizer.parentElement.classList.remove('hidden');
      } else {
        this.app.elements.previewOrganizer.parentElement.classList.add('hidden');
      }
    }
    
    // Update description
    if (this.app.elements.previewDescription) {
      if (eventData.description) {
        // Strip HTML tags for preview
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = eventData.description;
        const textContent = tempDiv.textContent || tempDiv.innerText || '';
        
        // Truncate if too long
        const maxLength = 100;
        let displayText = textContent;
        if (textContent.length > maxLength) {
          displayText = textContent.substring(0, maxLength) + '...';
        }
        
        this.app.elements.previewDescription.textContent = displayText;
        this.app.elements.previewDescription.classList.remove('hidden');
      } else {
        this.app.elements.previewDescription.classList.add('hidden');
      }
    }
    
    // Update button preview
    this.updateButtonPreview();
  }
  
  /**
   * Update the button preview based on current style settings
   */
  updateButtonPreview() {
    // Get the button preview element
    const buttonPreview = this.app.elements.buttonPreview.querySelector('button');
    if (!buttonPreview) return;
    
    // Update button style based on current settings
    if (this.app.state.buttonStyle === 'dark') {
      buttonPreview.className = 'inline-flex items-center gap-2 px-4 py-2 bg-neutralDark text-white rounded-lg text-sm font-medium hover:opacity-90 transition';
    } else {
      buttonPreview.className = 'inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-50 transition';
    }
    
    // Apply custom color if set
    if (this.app.state.buttonColor && this.app.state.buttonColor !== '#333333' && this.app.state.buttonStyle === 'dark') {
      buttonPreview.style.backgroundColor = this.app.state.buttonColor;
    } else {
      buttonPreview.style.backgroundColor = '';
    }
  }
}

/**
 * Generates code for calendar buttons and links
 */
class CodeGenerator {
  constructor(app) {
    this.app = app;
  }
  
  init() {
    // Initial code generation
    this.updateCode();
  }
  
  /**
   * Update the generated code based on current form values
   */
  updateCode() {
    const eventData = this.app.getEventData();
    const outputFormat = this.app.state.outputFormat;
    
    let code = '';
    
    if (outputFormat === 'button') {
      code = this.generateButtonCode(eventData);
    } else {
      code = this.generateLinksCode(eventData);
    }
    
    // Update code snippet
    if (this.app.elements.snippetCode) {
      this.app.elements.snippetCode.textContent = code;
    }
  }
  
  /**
   * Generate code for the "Add to Calendar" button
   */
  generateButtonCode(eventData) {
    // Create the button HTML
    const buttonStyle = this.app.state.buttonStyle;
    const buttonColor = this.app.state.buttonColor;
    
    let buttonClass = '';
    let buttonStyles = '';
    
    if (buttonStyle === 'dark') {
      buttonClass = 'bg-neutralDark text-white';
      if (buttonColor && buttonColor !== '#333333') {
        buttonStyles = `style="background-color: ${buttonColor};"`;
        buttonClass = 'text-white';
      }
    } else {
      buttonClass = 'bg-white border border-gray-200 text-gray-800';
    }
    
    // Generate calendar URLs
    const calendarUrls = this.generateCalendarUrls(eventData);
    
    // Create dropdown HTML
    let dropdownHtml = '';
    Object.keys(calendarUrls).forEach(platform => {
      if (this.app.state.platforms[platform]) {
        const platformInfo = this.getPlatformInfo(platform);
        dropdownHtml += `
          <a href="${calendarUrls[platform]}" target="_blank" rel="noopener noreferrer" 
             class="block px-4 py-2 text-sm hover:bg-gray-100">
            <span class="inline-flex items-center">
              <span class="mr-2">${platformInfo.icon}</span>
              ${platformInfo.name}
            </span>
          </a>`;
      }
    });
    
    // Complete button code with dropdown
    const code = `<!-- EasyCal Button -->
<div class="easycal-dropdown relative inline-block">
  <button class="easycal-button inline-flex items-center gap-2 px-4 py-2 ${buttonClass} rounded-lg text-sm font-medium hover:opacity-90 transition" ${buttonStyles}>
    <span class="text-base">📅</span>
    Add to Calendar
  </button>
  <div class="easycal-dropdown-content hidden absolute left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
    ${dropdownHtml}
  </div>
</div>

<script>
  // EasyCal Button Script
  document.addEventListener('DOMContentLoaded', function() {
    const button = document.querySelector('.easycal-button');
    const dropdown = document.querySelector('.easycal-dropdown-content');
    
    if (button && dropdown) {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        dropdown.classList.toggle('hidden');
      });
      
      // Close dropdown when clicking outside
      document.addEventListener('click', function(e) {
        if (!button.contains(e.target) && !dropdown.contains(e.target)) {
          dropdown.classList.add('hidden');
        }
      });
    }
  });
</script>`;
    
    return code;
  }
  
  /**
   * Generate code for individual calendar links
   */
  generateLinksCode(eventData) {
    // Generate calendar URLs
    const calendarUrls = this.generateCalendarUrls(eventData);
    
    // Create links HTML
    let linksHtml = '';
    Object.keys(calendarUrls).forEach(platform => {
      if (this.app.state.platforms[platform]) {
        const platformInfo = this.getPlatformInfo(platform);
        linksHtml += `<a href="${calendarUrls[platform]}" target="_blank" rel="noopener noreferrer" 
                      class="inline-flex items-center gap-1 px-3 py-1 ${platformInfo.class} rounded text-xs mb-2 mr-2">
                        <span>${platformInfo.icon}</span> ${platformInfo.name}
                      </a>\n`;
      }
    });
    
    // Complete links code
    const code = `<!-- EasyCal Links -->
<div class="easycal-links">
  <div class="text-sm mb-2">Add event to calendar:</div>
  <div class="flex flex-wrap">
    ${linksHtml}
  </div>
</div>`;
    
    return code;
  }
  
  /**
   * Generate calendar URLs for different platforms
   */
  generateCalendarUrls(eventData) {
    // Format dates for URLs
    const startDate = eventData.startDate ? new Date(`${eventData.startDate}T${eventData.startTime || '00:00'}`) : new Date();
    const endDate = eventData.endDate ? new Date(`${eventData.endDate}T${eventData.endTime || '00:00'}`) : new Date(startDate.getTime() + 3600000); // Default to 1 hour later
    
    // Format title and description for URLs
    const title = encodeURIComponent(eventData.title || 'Event');
    const location = encodeURIComponent(eventData.location || '');
    
    // Strip HTML from description
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = eventData.description || '';
    const description = encodeURIComponent(tempDiv.textContent || tempDiv.innerText || '');
    
    // Generate URLs for each platform
    return {
      apple: this.generateAppleCalendarUrl(title, startDate, endDate, description, location, eventData),
      google: this.generateGoogleCalendarUrl(title, startDate, endDate, description, location, eventData),
      outlook: this.generateOutlookCalendarUrl(title, startDate, endDate, description, location, eventData),
      outlookCom: this.generateOutlookComCalendarUrl(title, startDate, endDate, description, location, eventData),
      office365: this.generateOffice365CalendarUrl(title, startDate, endDate, description, location, eventData),
      yahoo: this.generateYahooCalendarUrl(title, startDate, endDate, description, location, eventData)
    };
  }
  
  /**
   * Format date for calendar URLs
   */
  formatDateForUrl(date, format) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    switch (format) {
      case 'google':
        return `${year}${month}${day}T${hours}${minutes}${seconds}`;
      case 'yahoo':
        return `${year}${month}${day}T${hours}${minutes}00Z`;
      case 'ics':
        return `${year}${month}${day}T${hours}${minutes}00`;
      default:
        return `${year}-${month}-${day}T${hours}:${minutes}:00`;
    }
  }
  
  /**
   * Generate Apple Calendar URL
   */
  generateAppleCalendarUrl(title, startDate, endDate, description, location, eventData) {
    // Apple Calendar uses .ics file format
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `SUMMARY:${title}`,
      `DTSTART:${this.formatDateForUrl(startDate, 'ics')}`,
      `DTEND:${this.formatDateForUrl(endDate, 'ics')}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');
    
    // Create data URI for .ics file
    const dataUri = `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`;
    return dataUri;
  }
  
  /**
   * Generate Google Calendar URL
   */
  generateGoogleCalendarUrl(title, startDate, endDate, description, location, eventData) {
    const baseUrl = 'https://calendar.google.com/calendar/render';
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: decodeURIComponent(title),
      dates: `${this.formatDateForUrl(startDate, 'google')}/${this.formatDateForUrl(endDate, 'google')}`,
      details: decodeURIComponent(description),
      location: decodeURIComponent(location),
      sf: 'true',
      output: 'xml'
    });
    
    return `${baseUrl}?${params.toString()}`;
  }
  
  /**
   * Generate Outlook Calendar URL
   */
  generateOutlookCalendarUrl(title, startDate, endDate, description, location, eventData) {
    // Outlook Desktop uses .ics file format (same as Apple)
    return this.generateAppleCalendarUrl(title, startDate, endDate, description, location, eventData);
  }
  
  /**
   * Generate Outlook.com Calendar URL
   */
  generateOutlookComCalendarUrl(title, startDate, endDate, description, location, eventData) {
    const baseUrl = 'https://outlook.live.com/calendar/0/deeplink/compose';
    const params = new URLSearchParams({
      subject: decodeURIComponent(title),
      startdt: startDate.toISOString(),
      enddt: endDate.toISOString(),
      body: decodeURIComponent(description),
      location: decodeURIComponent(location),
      path: '/calendar/action/compose'
    });
    
    return `${baseUrl}?${params.toString()}`;
  }
  
  /**
   * Generate Office 365 Calendar URL
   */
  generateOffice365CalendarUrl(title, startDate, endDate, description, location, eventData) {
    const baseUrl = 'https://outlook.office.com/calendar/0/deeplink/compose';
    const params = new URLSearchParams({
      subject: decodeURIComponent(title),
      startdt: startDate.toISOString(),
      enddt: endDate.toISOString(),
      body: decodeURIComponent(description),
      location: decodeURIComponent(location),
      path: '/calendar/action/compose'
    });
    
    return `${baseUrl}?${params.toString()}`;
  }
  
  /**
   * Generate Yahoo Calendar URL
   */
  generateYahooCalendarUrl(title, startDate, endDate, description, location, eventData) {
    const baseUrl = 'https://calendar.yahoo.com/';
    const params = new URLSearchParams({
      title: decodeURIComponent(title),
      st: this.formatDateForUrl(startDate, 'yahoo'),
      et: this.formatDateForUrl(endDate, 'yahoo'),
      desc: decodeURIComponent(description),
      in_loc: decodeURIComponent(location)
    });
    
    return `${baseUrl}?${params.toString()}`;
  }
  
  /**
   * Get platform information (name, icon, class)
   */
  getPlatformInfo(platform) {
    const platformInfo = {
      apple: {
        name: 'Apple',
        icon: '🍎',
        class: 'bg-black text-white'
      },
      google: {
        name: 'Google',
        icon: 'G',
        class: 'bg-white border border-gray-200 text-gray-700'
      },
      outlook: {
        name: 'Outlook',
        icon: '📧',
        class: 'bg-yellow-500 text-black'
      },
      outlookCom: {
        name: 'Outlook.com',
        icon: '◯',
        class: 'bg-blue-600 text-white'
      },
      office365: {
        name: 'Office 365',
        icon: '📦',
        class: 'bg-orange-500 text-white'
      },
      yahoo: {
        name: 'Yahoo',
        icon: 'Y!',
        class: 'bg-purple-600 text-white'
      }
    };
    
    return platformInfo[platform] || { name: platform, icon: '📅', class: 'bg-gray-500 text-white' };
  }
}

/**
 * Manages clipboard operations
 */
class CopyManager {
  constructor(app) {
    this.app = app;
  }
  
  init() {
    // Initialize copy functionality
  }
  
  /**
   * Copy generated code to clipboard
   */
  copyCode() {
    const code = this.app.elements.snippetCode.textContent;
    
    if (!code) {
      console.warn('No code to copy');
      return;
    }
    
    // Use Clipboard API if available
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code)
        .then(() => this.showCopySuccess())
        .catch(err => {
          console.error('Could not copy text: ', err);
          this.fallbackCopy(code);
        });
    } else {
      this.fallbackCopy(code);
    }
  }
  
  /**
   * Fallback copy method for browsers without Clipboard API
   */
  fallbackCopy(text) {
    // Create a temporary textarea
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Make the textarea out of viewport
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    
    // Select and copy
    textArea.focus();
    textArea.select();
    
    let success = false;
    try {
      success = document.execCommand('copy');
    } catch (err) {
      console.error('Fallback copy failed:', err);
    }
    
    // Clean up
    document.body.removeChild(textArea);
    
    if (success) {
      this.showCopySuccess();
    }
  }
  
  /**
   * Show copy success toast
   */
  showCopySuccess() {
    const toast = this.app.elements.copySuccess;
    if (!toast) return;
    
    // Show toast
    toast.classList.add('show');
    
    // Hide after 2 seconds
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2000);
  }
}

/**
 * Manages the smart editor functionality
 */
class EditorManager {
  constructor(app) {
    this.app = app;
  }
  
  init() {
    // Initialize smart editor
    this.setupEditor();
  }
  
  /**
   * Set up the smart editor
   */
  setupEditor() {
    const editor = this.app.elements.smartEditor;
    const toolbar = this.app.elements.smartToolbar;
    const hiddenInput = this.app.elements.description;
    
    if (!editor || !toolbar) return;
    
    // Update hidden input when editor content changes
    editor.addEventListener('input', () => {
      if (hiddenInput) {
        hiddenInput.value = editor.innerHTML;
      }
      this.app.updatePreview();
    });
    
    // Handle toolbar button clicks
    const buttons = toolbar.querySelectorAll('button');
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const format = button.dataset.format;
        if (format) {
          this.applyFormat(format);
        }
      });
    });
    
    // Handle keyboard shortcuts
    editor.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'b':
            e.preventDefault();
            this.applyFormat('bold');
            break;
          case 'i':
            e.preventDefault();
            this.applyFormat('italic');
            break;
          case 'u':
            e.preventDefault();
            this.applyFormat('underline');
            break;
        }
      }
    });
  }
  
  /**
   * Apply formatting to selected text
   */
  applyFormat(format) {
    const editor = this.app.elements.smartEditor;
    if (!editor) return;
    
    // Focus the editor
    editor.focus();
    
    // Apply formatting based on type
    switch (format) {
      case 'bold':
        document.execCommand('bold', false, null);
        break;
      case 'italic':
        document.execCommand('italic', false, null);
        break;
      case 'underline':
        document.execCommand('underline', false, null);
        break;
      case 'bulletList':
        document.execCommand('insertUnorderedList', false, null);
        break;
      case 'link':
        const url = prompt('Enter URL:', 'https://');
        if (url) {
          document.execCommand('createLink', false, url);
        }
        break;
    }
    
    // Update hidden input
    if (this.app.elements.description) {
      this.app.elements.description.value = editor.innerHTML;
    }
    
    // Update preview
    this.app.updatePreview();
  }
}

/**
 * Manages UI interactions
 */
class UIManager {
  constructor(app) {
    this.app = app;
  }
  
  init() {
    // Initialize UI state
  }
  
  /**
   * Set output format (button or links)
   */
  setOutputFormat(format) {
    this.app.state.outputFormat = format;
    
    // Update UI
    if (format === 'button') {
      this.app.elements.buttonFormat.classList.add('bg-primary', 'text-white');
      this.app.elements.buttonFormat.classList.remove('bg-gray-100', 'text-gray-700');
      this.app.elements.linksFormat.classList.add('bg-gray-100', 'text-gray-700');
      this.app.elements.linksFormat.classList.remove('bg-primary', 'text-white');
      
      this.app.elements.buttonPreview.classList.remove('hidden');
      this.app.elements.linksPreview.classList.add('hidden');
      this.app.elements.buttonCustomization.classList.remove('hidden');
    } else {
      this.app.elements.linksFormat.classList.add('bg-primary', 'text-white');
      this.app.elements.linksFormat.classList.remove('bg-gray-100', 'text-gray-700');
      this.app.elements.buttonFormat.classList.add('bg-gray-100', 'text-gray-700');
      this.app.elements.buttonFormat.classList.remove('bg-primary', 'text-white');
      
      this.app.elements.linksPreview.classList.remove('hidden');
      this.app.elements.buttonPreview.classList.add('hidden');
      this.app.elements.buttonCustomization.classList.add('hidden');
    }
    
    // Update code
    this.app.codeGenerator.updateCode();
  }
  
  /**
   * Set button style (dark or light)
   */
  setButtonStyle(style) {
    this.app.state.buttonStyle = style;
    
    // Update UI
    if (style === 'dark') {
      this.app.elements.style1.classList.add('bg-neutralDark', 'text-white');
      this.app.elements.style1.classList.remove('bg-gray-200', 'text-gray-700');
      this.app.elements.style2.classList.add('bg-gray-200', 'text-gray-700');
      this.app.elements.style2.classList.remove('bg-neutralDark', 'text-white');
    } else {
      this.app.elements.style2.classList.add('bg-neutralDark', 'text-white');
      this.app.elements.style2.classList.remove('bg-gray-200', 'text-gray-700');
      this.app.elements.style1.classList.add('bg-gray-200', 'text-gray-700');
      this.app.elements.style1.classList.remove('bg-neutralDark', 'text-white');
    }
    
    // Update preview and code
    this.app.updatePreview();
  }
  
  /**
   * Set button color
   */
  setButtonColor(color) {
    this.app.state.buttonColor = color;
    
    // Update preview and code
    this.app.updatePreview();
    
    // Hide color picker
    this.toggleColorPicker(false);
  }
  
  /**
   * Toggle color picker panel
   */
  toggleColorPicker(show) {
    if (this.app.elements.colorPickerPanel) {
      if (show === undefined) {
        this.app.elements.colorPickerPanel.classList.toggle('hidden');
      } else if (show) {
        this.app.elements.colorPickerPanel.classList.remove('hidden');
      } else {
        this.app.elements.colorPickerPanel.classList.add('hidden');
      }
    }
  }
  
  /**
   * Show custom color picker
   */
  showCustomColorPicker() {
    // Create a color input
    const input = document.createElement('input');
    input.type = 'color';
    input.value = this.app.state.buttonColor;
    
    // Handle color selection
    input.addEventListener('input', (e) => {
      this.setButtonColor(e.target.value);
    });
    
    // Trigger click to open color picker
    input.click();
  }
  
  /**
   * Toggle share dropdown
   */
  toggleShareDropdown(show) {
    if (this.app.elements.shareDropdown) {
      if (show === undefined) {
        this.app.elements.shareDropdown.classList.toggle('hidden');
        this.app.elements.shareDropdown.classList.toggle('block');
      } else if (show) {
        this.app.elements.shareDropdown.classList.remove('hidden');
        this.app.elements.shareDropdown.classList.add('block');
      } else {
        this.app.elements.shareDropdown.classList.add('hidden');
        this.app.elements.shareDropdown.classList.remove('block');
      }
    }
  }
  
  /**
   * Toggle timezone section
   */
  toggleTimezoneSection() {
    if (this.app.elements.timezoneSection) {
      this.app.elements.timezoneSection.classList.toggle('hidden');
      this.app.state.showTimezone = !this.app.elements.timezoneSection.classList.contains('hidden');
      
      // Update button text
      if (this.app.elements.showTimezone) {
        this.app.elements.showTimezone.textContent = this.app.state.showTimezone ? 
          'Hide timezone options' : 'Show timezone options';
      }
    }
  }
}
