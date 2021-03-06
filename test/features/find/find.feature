Feature: Find data
  As a User  
  I want to find data within the current column or across the current table  
  So that I can determine if the data exists and correct it if necessary  

  RULES
  =====

  - Users can choose a search constraint to find data across the table or within the current column
  - The default search constraint is find in table
  - When "Find next" is invoked but no values are found on reaching the end of the column/table, start the search from the top of the table
  - When "Find previous" is invoked but no values are found on reaching the top of the column/table, start the search from the bottom of the table
  - "Find" can be invoked using a toolbar, menu item, toolbar, or keyboard shortcut
  - "Find next" and "Find previous" can be invoked using a using a menu item, button or keyboard shortcut
  - "Find next" and "Find previous" can only be invoked after a search value has been entered

  NOTES
  =====
  
  - https://docs.handsontable.com/0.34.4/demo-searching.html
  
  USER INTERFACE
  ==============
  
  ![Data Curator Find and Replace user interface](https://github.com/ODIQueensland/data-curator/raw/develop/static/img/ui/find-and-replace.png)

  Scenario: Find 
    Given Data Curator is open
    When "Find" is invoked
    Then a prompt for a search value and search constraints should be displayed
    And a prompt for a replacement value should be displayed

  Scenario: Find next
    Given Data Curator is open
    And a search value and optionally search constraints have been entered
    When "Find Next" is invoked
    Then all the cells with values that match the search value and comply with the search constraints should be shaded green
    And the cursor should be moved to next cell after the current active cell that matches the search value and complies with the search constraints 
    And that cell's border should be highlighted
    And a count of all the values that match the search value and comply with the search constraints should be displayed
    And a number representing which instance of the data that has been found value should be displayed

  Scenario: Find previous
    Given Data Curator is open
    And a search value and optionally search constraints have been entered
    When "Find Previous" is invoked
    Then all cells with values that match the search value and comply with the search constraints should be highlighted
    And the cursor should be moved to next cell after the current active cell that matches the search value and complies with the search constraints 
    And that cell's border should be highlighted
    And a count of all the values that match the search value and comply with the search constraints should be displayed
    And a number representing which instance of the data that has been found value should be displayed
