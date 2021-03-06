Feature: Insert Column Before
  As a Data Packager  
  I want to insert another column before the current column  
  So that I can add more data to the data table  

  RULES
  =====

  - The "Insert Column Before" command can be invoked using a menu item, keyboard shortcut or a context menu in the data tab

  Scenario: Use the menu to insert a column before the current column
    Given the cursor is in a data table
    When "Insert Column Before" is invoked
    Then a column should be inserted before the current column
