pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_VERSION = 'v2.23.0'
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/Aryangupta6612/django-todo-cicd.git', branch: 'develop'
            }
        }

        stage('Build and Deploy') {
            steps {
                sh '''
                    # Clean up previous containers
                    docker compose down || true
                    
                    # Build and start
                    docker compose up -d --build
                    
                    # Wait for health check
                    echo "Waiting for application to become healthy..."
                    timeout 60s bash -c 'until docker compose ps | grep "healthy"; do sleep 5; done' || exit 1
                    
                    # Verify from Jenkins container
                    docker run --network todo-app-cicd_app_network curlimages/curl \
                      curl -s http://web:8000 || exit 1
                '''
            }
        }
    }

    post {
        always {
            sh 'docker container prune -f || true'
            sh 'docker image prune -f || true'
        }
        success {
            echo '✅ Build and deployment successful!'
        }
        failure {
            echo '❌ Build failed. Please check the logs!'
            sh 'docker compose logs web'
        }
    }
}