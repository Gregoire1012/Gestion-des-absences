pipeline {
    agent any

    stages {
        stage('Test Environment') {
            steps {
                sh 'echo ===== TEST ====='
                sh 'whoami'
                sh 'pwd'
                sh 'node -v || echo "Node non installé"'
                sh 'npm -v || echo "NPM non installé"'
            }
        }
    }
}
