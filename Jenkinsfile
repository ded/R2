@Library('pureconnect-builds') _

pipeline {
    agent {
        label 'linux && node10'
    }

    stages {
        stage('Bootstrap') {
            steps {
                sh 'npm ci'
            }
        }
        stage('Test') {
            steps {
                sh 'npm run test'
            }
        }
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        stage('Publish') {
            steps {
                echo 'Publish to artifactory'
                publishNpmPackage()
            }
        }
    }
}