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
- **Hosting**: Vercel (for the frontend)

## Features

- Responsive design
- Fast loading times with Next.js optimization
- RESTful API built with Express.js
- Dockerized setup for easy deployment

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

### Running the Backend

1. Navigate to the `api` folder:

    ```bash
    cd api
    ```

2. Build and run the Docker container:

    ```bash
    docker-compose up --build
    ```

### Running the Frontend

1. Navigate to the frontend folder:

    ```bash
    cd frontend
    ```

2. Start the development server:

    ```bash
    npm install
    npm start
    ```

## Deployment

- **Frontend**: Deployed on [Vercel](https://vercel.com/)
- **Backend**: Dockerized and can be deployed using Docker.

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
