# Style Guide
This document is a style guide which contains styling conventions to be followed by our team.

## Line length
Recommended limit of line length:  
**80 characters including whitespace**


## Braces {}
Always use braces even when they are not required in some looping or selection functions.
```
statement header {
    body
    body
}
```

## Whitespace
Use horizontal whitespace to organize each line of code into meaningful parts. 

**good style	```result = 5 * abs(xCoord - ++yCoord) / (11 % -time)```**  
**bad style	```result=5*abs(xCoord-++yCoord)/(11%-time)```**

**good style	```for (day = 11; day < 22 && !done; ++day) {```**  
**bad style	```for(day=11;day<2&&!done;++day){```**


## Indentation
Use **4 spaces** to indicate each level of nesting.

#### if & for loop
```
if (day == 31) 
{
    monthTotal = 0;
    for (int week = 0; week < 4; ++week) 
    {
        monthTotal += receipts[week];
    }
}
```
#### chained if-else	
```
if (month >= 1 && month <= 3)
    quarter = 1;
else if (month >= 4 && month <= 6)
    quarter = 2;
else if (month >= 7 && month <= 9)
    quarter = 3;
else
    quarter = 4;
```
#### switch
```
switch (month) 
{
    case 2:
        daysInMonth = 28;
        break;
    case 4:
    case 6:
    case 9:
    case 11:
        daysInMonth = 28;
        break;
    default:
        daysInMonth = 31;
        break;
}
```

## Proper Naming
Do not begin names with underscore (_) characters.
Variable and function names begin with a lowercase letter. namesWithMultiple_words use initial capitals or underscores.
CONSTANTS are in all uppercase letters. MULTI_WORD_CONSTANTS use an underscore to separate words.
Use descriptive names. It must relate to the intended use. 
Short (i.e. 1 letter) names can be used for temporary variables and loop counters.

**tableHeight is more descriptive than th**


## Use Symbolic Constants instead of magic numbers
Define symbolic constants to avoid the need to use literal values.  
**Use PI instead of 3.1415927 in calculations or comparisons**

