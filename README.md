<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/emilianox/pocketo">
    <img src="public/pocketo_v1.svg" alt="Logo" width="109" height="78">
  </a>

  <h3 align="center">Pocketo!</h3>

  <p align="center">
    A Pocket UI supercharged !
    <br />
    <a href="https://github.com/emilianox/pocketo"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <!-- <a href="https://github.com/emilianox/pocketo">View Demo</a>
    · -->
    <a href="https://github.com/emilianox/pocketo/issues">Report Bug</a>
    ·
    <a href="https://github.com/emilianox/pocketo/issues">Request Feature</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

There are many great Pocket clients, however, I didn't find one that really suit my needs, so I created this enhanced one. I want to create a client focused on speed and UX and advanced filtering. I also want to put an emphasis on offline reading. I'm currently working on the first release of the application.

Here's why:
* Pocket web app is focused on read more than search 
* Search by tags must be a first class.
* Search by domain are great.
* Advanced search capacities is a must.
* Webpage access first and then pocket's cache.
* Filtering by tags must be fast.
* Offline reading support in web.
* Simple UI.
* Fast.
* Great UX.


The application is still in an early state, but the main features are already implemented:
* Search by tags and text combined
* Filter by domain
* Filter by Read/Unread
* Clear search
* Filter by starred
* Sort by age, domain
* Archive
* Star
* Add and revome tags
* Copy link
* Whatsapp and Telegram share
* View Pocket cache
* Remove
* Shortcuts(now only ctrl+enter to add save tags)
* Image support

Of course, at the end, this is a mostly opinionated client of pocket. 
Please suggest changes by forking this repo and creating a pull request or opening an issue. Thanks to all the people have contributed to expanding this template!


### Built With

* [React](https://reactjs.org/)
* [Next.js](https://nextjs.org/)
* [Tailwinds](https://tailwindcss.com/)
* [DaisyUI](https://github.com/saadeghi/daisyui)
* [React Query](https://react-query.tanstack.com/)

<!-- GETTING STARTED -->
## Getting Started


### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Get a free API Key at [https://getpocket.com/developer/apps/](https://example.com)
2. Clone the repo
   ```sh
   git clone https://github.com/emilianox/pocketo.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Enter your API credentials in `.env.local`
  You can generate the POCKET_ACCESS_TOKEN using the `/api/auth` endpoint in the console 
   ```sh
    SECRET= xxxxxxxxxxxxxxxxxxxxxxx # Linux: `openssl rand -hex 32` or go to https://generate-secret.now.sh/32
    POCKET_CONSUMER_KEY=xxxxxxxxxxxxxxxxxxxxxx
    POCKET_REDIRECT_URI=http://localhost:3000/api/items
    POCKET_ACCESS_TOKEN=xxxxxxxxxxxxxxxxxxxxxx
   ```
5. Run in production mode
   ```sh
   npm run production
   ```



<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/emilianox/pocketo/issues) for a list of proposed features (and known issues).



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/emilianox/pocketo.svg?style=for-the-badge
[contributors-url]: https://github.com/emilianox/pocketo/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/emilianox/pocketo.svg?style=for-the-badge
[forks-url]: https://github.com/emilianox/pocketo/network/members
[stars-shield]: https://img.shields.io/github/stars/emilianox/pocketo.svg?style=for-the-badge
[stars-url]: https://github.com/emilianox/pocketo/stargazers
[issues-shield]: https://img.shields.io/github/issues/emilianox/pocketo.svg?style=for-the-badge
[issues-url]: https://github.com/emilianox/pocketo/issues
[license-shield]: https://img.shields.io/github/license/emilianox/pocketo.svg?style=for-the-badge
[license-url]: https://github.com/emilianox/pocketo/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/emilianohfernandez
[product-screenshot]: public/screenshot-pocketo.png