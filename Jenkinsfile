pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
        DATABASE_URL = 'postgresql://postgres:1234@localhost:5432/gestion_absences'
    }

    stages {

        stage('Clean Workspace') {
            steps {
                sh 'rm -rf node_modules .next'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Prisma Generate') {
            steps {
                sh 'npx prisma generate'
            }
        }

        stage('Prisma Migrate') {
            steps {
                sh 'npx prisma migrate deploy'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Start App') {
            steps {
                sh 'pkill node || true'
                sh 'nohup npm start &'
            }
        }
    }

    post {
        success {
            echo '✅ Déploiement réussi'
        }
        failure {
            echo '❌ Échec pipeline'
        }
    }
}
