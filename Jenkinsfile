pipeline {
    agent any

    stages {

        stage('Java Version') {
            steps {
                sh 'java -version'
                sh 'javac -version'
            }
        }

        stage('Backend Sonar') {
            steps {
                dir('backend') {
                    sh 'chmod +x mvnw'

                    withSonarQubeEnv('sq1') {
                        sh '''
                            ./mvnw clean verify sonar:sonar \
                              -Dsonar.projectKey=mrinspecteur-backend \
                              -Dsonar.projectName="MR Inspecteur Backend"
                        '''
                    }
                }
            }
        }

        stage('Frontend Install') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }

        stage('Frontend Sonar') {
            steps {
                dir('frontend') {
                    script {
                        def scannerHome = tool 'SonarScanner'

                        withSonarQubeEnv('sq1') {
                            sh """
                                ${scannerHome}/bin/sonar-scanner \
                                  -Dsonar.projectKey=mrinspecteur-frontend \
                                  -Dsonar.projectName="MR Inspecteur Frontend" \
                                  -Dsonar.sources=src
                            """
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
