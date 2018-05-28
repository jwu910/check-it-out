# Check It Out
![Check It Out](docs/assets/images/checkit-intro.gif)

![npm](https://img.shields.io/npm/dt/check-it-out.svg)
![npm version](https://badge.fury.io/js/check-it-out.svg)
![GitHub version](https://badge.fury.io/gh/jwu910%2Fcheck-it-out.svg)

Check it out, before you checkout.

Check It Out lets you interactively see and choose what branch you want to check out without the hassle of trying to type out a long or confusing branch name. Checking out branches just got even simpler!

## Requirements
[Node >= v6.0](https://nodejs.org/en/blog/release/v6.0.0/)

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

![Check It Out Usage](docs/assets/images/checkit-usage.gif)

Call git log on current highlighted branch with `[space]`

![Quick Git Log!](docs/assets/images/checkit-log.gif)


| Commands | Description |
| -------- | ------------ |
|`j/k, down/up`| Navigate the list |
|`h/l, left/right`| Previous/Next remote |
|`r`| Refresh list with a fetch and prune |
|`enter`| Select highlighted item |
|`space`| Git log |
|`q, C-c, esc`| Quit |

## Contributing
Please refer to the [Contributing Guidelines](./CONTRIBUTING.md)

### License
MIT @ [Joshua Wu](https://www.npmjs.com/~jwu910)

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars0.githubusercontent.com/u/29239201?v=4" width="80px;"/><br /><sub><b>Brandon Benefield</b></sub>](https://www.bbenefield.com)<br />[📖](https://github.com/jwu910/check-it-out/commits?author=bbenefield89 "Documentation") | [<img src="https://avatars1.githubusercontent.com/u/32409546?v=4" width="80px;"/><br /><sub><b>Aaron Casanova</b></sub>](https://github.com/casyjs)<br />[💻](https://github.com/jwu910/check-it-out/commits?author=casyjs "Code") | [<img src="https://avatars1.githubusercontent.com/u/6403097?v=4" width="80px;"/><br /><sub><b>Drew Brokke</b></sub>](https://github.com/drewbrokke)<br />[💻](https://github.com/jwu910/check-it-out/commits?author=drewbrokke "Code") [🤔](#ideas-drewbrokke "Ideas, Planning, & Feedback") | [<img src="https://avatars3.githubusercontent.com/u/35710155?v=4" width="80px;"/><br /><sub><b>Johanna Tchon</b></sub>](https://github.com/jotchon)<br />[💻](https://github.com/jwu910/check-it-out/commits?author=jotchon "Code") | [<img src="https://avatars1.githubusercontent.com/u/18720522?v=4" width="80px;"/><br /><sub><b>Jenell Pizarro</b></sub>](https://www.jenellpizarro.com/)<br />[📖](https://github.com/jwu910/check-it-out/commits?author=nellarro "Documentation") |
| :---: | :---: | :---: | :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->
