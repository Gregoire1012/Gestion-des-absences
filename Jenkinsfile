pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
        DATABASE_URL = 'postgresql://postgres:1234@localhost:5432/gestion_absences'
        NEXT_TELEMETRY_DISABLED = '1'
    }

    options {
        timestamps()
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Clean Workspace') {
            steps {
                sh '''
                    echo "🧹 Cleaning workspace..."
                    rm -rf node_modules .next
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    echo "📦 Installing dependencies..."
                    npm install --no-audit --no-fund
                '''
            }
        }

        stage('Verify Dependencies') {
            steps {
                sh '''
                    echo "🔎 Checking critical dependencies..."
                    node -v
                    npm -v
                    npm ls next prisma || true
                '''
            }
        }

        stage('Prisma Generate') {
            steps {
                sh '''
                    echo "⚙️ Generating Prisma Client..."
                    npx prisma generate
                '''
            }
        }

        stage('Prisma Migrate') {
            steps {
                sh '''
                    echo "🗄️ Running database migrations..."
                    npx prisma migrate deploy
                '''
            }
        }

        stage('Lint (Optional)') {
            steps {
                sh '''
                    echo "🧼 Linting project..."
                    npm run lint || true
                '''
            }
        }

        stage('Build') {
            steps {
                sh '''
                    echo "🏗️ Building Next.js app..."
                    npm run build
                '''
            }
        }

        stage('Archive Build') {
            steps {
                sh '''
                    echo "📦 Archiving build artifacts..."
                    tar -czf build.tar.gz .next
                '''
                archiveArtifacts artifacts: 'build.tar.gz', fingerprint: true
            }
        }

        stage('Deploy (Safe Mode)') {
            steps {
                sh '''
                    echo "🚀 Starting application..."
                    pkill node || true
                    nohup npm start > app.log 2>&1 &
                '''
            }
        }
    }

    post {
        success {
            echo "✅ CI/CD SUCCESS - Deployment OK"
        }

        failure {
            echo "❌ CI/CD FAILED - Check logs"
        }

        always {
            echo "📊 Pipeline finished"
        }
    }
}
