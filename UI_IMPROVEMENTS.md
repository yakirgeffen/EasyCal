# EasyCal UI Improvements

This document outlines the UI/UX improvements being implemented for the EasyCal application based on user requirements.

## Current Changes

### 1. Event Title Placeholder
- **Before**: "Title of your event"
- **After**: "[Event Title]"
- **Reason**: A placeholder name shouldn't look like actual text or an event name. Using square brackets makes it clear it's a placeholder.

### 2. Date and Time Section
- **Planned Changes**:
  - Make the "when" section more concise, possibly on same lines
  - Add AM/PM time selection instead of 24-hour format
  - Set default start time to rounded next 30 mins of current hour
  - Set default end time to start time + 1 hour
  - Hide timezone as an option, not part of the main form

### 3. Event Options
- **Planned Changes**:
  - Move "All day, recurring, RSVP" options closer to the time section

### 4. Description Field
- **Planned Changes**:
  - Make the description part smaller (it's an event, not a letter)
  - Improve the title
  - Remove the platform status indicator

### 5. Live Preview
- **Planned Changes**:
  - Make the preview look closer to how an event actually appears on a calendar
  - Make the output format smaller, clearer, and more concise from a UX/UI perspective

### 6. Button Styling
- **Planned Changes**:
  - Fix button style issues
  - Add option for users to select their own color to match branding

### 7. Calendar Platform Selection
- **Planned Changes**:
  - Move calendar platform selection to be part of the form, not on the right side underneath the preview
  - Remove platform icons, using color for differentiation

### 8. Generated Code
- **Planned Changes**:
  - Hide generated code by default, with an option to show it
  - Add option to copy the "Add to Calendar" button
  - Add option to copy all calendar platform buttons

## Implementation Plan

1. First pass: Update basic UI elements (placeholders, field sizes)
2. Second pass: Restructure the form layout (moving sections, hiding timezone)
3. Third pass: Enhance the time selection with AM/PM and default time logic
4. Fourth pass: Improve the live preview to better match calendar appearance
5. Fifth pass: Implement button styling and color selection
6. Sixth pass: Reorganize platform selection and code generation options

## Design Principles

- **Clarity**: Make it obvious what each element does
- **Conciseness**: Remove unnecessary elements and text
- **Flexibility**: Allow customization for branding
- **Usability**: Prioritize common use cases
