# Check It Out
[![npm version](https://badge.fury.io/js/check-it-out.svg)](https://badge.fury.io/js/check-it-out) [![GitHub version](https://badge.fury.io/gh/jwu910%2Fcheck-it-out.svg)](https://badge.fury.io/gh/jwu910%2Fcheck-it-out)
Check it out, before you checkout.

Too many keystrokes just to checkout a branch? Tired of long branch names? Don't remember what branches are available? Don't be bothered by fix-a-bug-where-code-is-broken-because-bad branch names any more! Check It Out gives you the interactive power to see your branches and check them out with fewer keystrokes.

## Requirements
[Node >= v7.0](https://nodejs.org/en/blog/release/v7.0.0/) - Required for async/await
[Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) - Required for core features

## Installation
We're on [NPM!](https://www.npmjs.org/package/check-it-out)
```
npm install -g check-it-out
```

#### Installing from source
[Fork](https://github.com/jwu910/check-it-out#fork-destination-box) or clone the repository
```
git clone https://github.com/jwu910/check-it-out.git
```

Navigate to your repository directory and run
```
npm install
```

Create a symbolic link to the entry point

###### Linux/Mac:
Navigate to a desired destination directory currently in your path.
```
ln -s /path/to/check-it-out/index.js checkit
```

## Usage
Run this command to list local and remote branches!
```
checkit
```

| Commands | Description |
| -------- | ------------ |
|`j/k, down/up`| Navigate the list |
|`h/l, left/right`| Previous/Next remote |
|`r`| Fetch, prune, and refresh list |
|`enter`| Select highlighted item |
|`q, C-c, esc`| Exit check-it-out |

## Contributing
Please refer to the [Contributing Guidelines](./CONTRIBUTING.md)

### License
MIT @ [Joshua Wu](https://www.npmjs.com/~jwu910)