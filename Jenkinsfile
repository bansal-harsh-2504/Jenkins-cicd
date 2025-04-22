pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_VERSION = 'v2.23.0'
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/bansal-harsh-2504/Jenkins-cicd.git', branch: 'main'
            }
        }

        stage('Inject Env File') {
            steps {
                withCredentials([file(credentialsId: 'my-env-file', variable: 'ENV_FILE')]) {
                    sh "cp \$ENV_FILE ./backend/.env"
                }
            }
        }

        stage('Build and Deploy') {
            steps {
                script {
                    echo "Running docker compose down"
                    sh 'docker-compose down || true'
                    
                    echo "Running docker compose up"
                    sh 'docker-compose up -d --build'
                    
                    echo "Testing frontend availability"
                    sh 'curl -s http://host.docker.internal:3000 || exit 1'
                }
            }
        }
    }

    post {
        always {
            echo "Cleaning up containers"
            sh 'docker container prune -f || true'
            sh 'docker image prune -f || true'
        }
        success {
            echo '✅ Build and deployment successful!'
        }
        failure {
            echo '❌ Build failed. Please check the logs!'
            sh 'docker-compose logs backend || true'
            sh 'docker-compose logs frontend || true'
        }
    }
}
