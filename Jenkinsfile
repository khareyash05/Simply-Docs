pipeline {
    agent { 
        node {
            label 'jenkins-agent-js'
            }
      }
    stages {
      stage('Clone') {
            steps {
                echo "Cloning.."
                sh '''
                npm install
                '''
            }
        }
        stage('Build') {
            steps {
                echo "Building.."
                sh '''
                npm run build
                '''
            }
        }
        stage('Test') {
            steps {
                echo "Testing.."
                sh '''
                npm run test
                '''
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
                sh '''
                firebase deploy
                '''
            }
        }
    }
}
