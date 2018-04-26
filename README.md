
# Smart Random

Generate random objects using an array of sources with weighting, tagging, and filtering.


## Table of Contents

  * [Requirements](#requirements)
  * [Usage](#usage)
  * [Contributing](#contributing)
  * [License](#license)


## Requirements

Smart Random requires one of the following environments to run:

  * [Node.js] 8+


## Usage

Install Smart Random with [npm]:

```sh
npm install smart-random
```

Then you can load the module into your code with a `require` call:

```js
const smartRandom = require('smart-random');
```

### Creating a generator

Create a generator by calling `smartRandom` with a set of data sources. The order of these sources matters – later sources can depend on tags that are defined in earlier sources. It's easiest to explain in code:

```js
// Generate a random cat
const catMe = smartRandom([
    // Each object in this array is a source

    {
        // This is the name of the source. When the generator
        // is run, it will define a property with this name on
        // the returned object
        name: 'color',

        // The items in the source
        items: [
            {
                // The value to set the property to if this item
                // is selected at random
                value: 'Black',

                // The tags to apply to the resulting object if
                // this item is selected
                tags: ['c:black'],

                // The weighting for this item which is how
                // likely the item is to be selected against
                // other items in the same source
                weight: 2
            },
            {
                value: 'Ginger',
                tags: ['c:ginger'],
                weight: 2
            },
            {
                value: 'White',
                tags: ['c:white'],
                weight: 1
            }
        ]
    },

    {
        // The second source here can depend on tags defined
        // in the source(s) above it. In this case, certain
        // names will only be selected if the cat is an
        // appropriate color
        name: 'name',
        items: [
            {
                // The name "Snowball" will only be selected
                // if tag "c:white" was set by a previous item
                value: 'Snowball',
                only: ['c:white']
            },
            {
                // The name "Fluffy" can be selected regardless
                // of cat color. Also the property "isLongHaired"
                // will be added
                value: 'Fluffy',
                add: {isLongHaired: true}
            },
            {
                // The name "Lucky" can be selected unless the
                // tag "c:black" was set by a previous item
                value: 'Lucky',
                not: ['c:black']
            },
            {
                // When the item's value property is a function,
                // it is called with the current result object.
                // This allows for more complex and
                // logic-driven items
                value: result => {
                    result.isBouncy = true;
                    return 'Tigger';
                },
                only: ['c:ginger']
            }
        ]
    }
]);

// The returned generator can now be called
// to generate random cats:
catMe();
// {
//     color: 'white',
//     name: 'Snowball',
//     tags: ['c:white']
// }
```


## Contributing

To contribute to Smart Random, clone this repo locally and commit your code on a separate branch. Please write unit tests for your code, and run the linter before opening a pull-request:

```sh
make test    # run all tests
make verify  # run all linters
```


## License

Smart Random is licensed under the [MIT] license.  
Copyright &copy; 2018, Rowan Manning



[mit]: LICENSE
[node.js]: https://nodejs.org/
[npm]: https://www.npmjs.com/
