# upayan.dev

![GitHub stars](https://img.shields.io/github/stars/upayanmazumder/upayan.dev?style=social)
![GitHub forks](https://img.shields.io/github/forks/upayanmazumder/upayan.dev?style=social)
![License](https://img.shields.io/badge/license-MIT-green)

Welcome to the source code repository for my personal website. This project showcases my portfolio, skills, and various projects.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Features](#features)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Code of Conduct](#code-of-conduct)
- [License](#license)

## Technologies Used

- **Frontend**: [Next.js](https://nextjs.org/)
- **Backend**: [Express.js](https://expressjs.com/)
- **Containerization**: Docker
- **Hosting**: Docker with Caddy (hosted on a personal VM)

## Deployment

- **Frontend and Backend**: Deployed using Docker and served with [Caddy](https://caddyserver.com/) on a personal VM.

## Features

- Responsive design
- Fast loading times with Next.js optimization
- RESTful API built with Express.js
- Dockerized setup for easy deployment with Caddy as a reverse proxy

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Docker](https://www.docker.com/get-started)
- Node.js (for local development)

### Cloning the Repository

```bash
git clone https://github.com/upayanmazumder/upayan.dev.git
cd upayan.dev
```

### Running the Application

You can run the application either using Docker (recommended for production-like environments) or locally using `npm run dev` for development purposes.

#### Option 1: Using Docker

The application is fully containerized using Docker. Follow these steps to run both the backend and frontend:

1. Ensure Docker is installed and running on your system. If not, download it from [Docker's official website](https://www.docker.com/get-started).

2. Build and start the containers using `docker-compose`:

    ```bash
    docker-compose up --build
    ```

3. Once the containers are running, access the application:

    - **Frontend**: Open [http://localhost:3000](http://localhost:3000) in your browser.
    - **Backend**: The API will be available at [http://localhost:4000](http://localhost:4000).

4. To stop the containers, press `Ctrl+C` in the terminal and run:

    ```bash
    docker-compose down
    ```

#### Option 2: Local Development

For local development, you can use the `npm run dev` command in the project root. This will start both the frontend and backend concurrently.

1. Ensure you have Node.js installed on your system. If not, download it from [Node.js official website](https://nodejs.org/).

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Start the development server:

    ```bash
    npm run dev
    ```

4. Once the server is running, access the application:

    - **Frontend**: Open [http://localhost:3000](http://localhost:3000) in your browser.
    - **Backend**: The API will be available at [http://localhost:4000](http://localhost:4000).

5. To stop the development server, press `Ctrl+C` in the terminal.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch:

    ```bash
    git checkout -b feature/YourFeature
    ```

3. Make your changes and commit them:

    ```bash
    git commit -m "Add your feature"
    ```

4. Push to your branch:

    ```bash
    git push origin feature/YourFeature
    ```

5. Open a pull request.

## Code of Conduct

Please read our [Code of Conduct](https://github.com/upayanmazumder/upayan.dev/blob/master/CODE_OF_CONDUCT.md) to ensure a welcoming environment for all contributors.

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/upayanmazumder/upayan.dev/blob/master/LICENSE) file for details.
