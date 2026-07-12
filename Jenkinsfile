pipeline {
    agent any

    stages {

        stage('Java Version') {
            steps {
                sh 'java -version'
                sh 'javac -version'
            }
        }

        stage('OWASP Dependency Check') {
            steps {
                dependencyCheck(
                    odcInstallation: 'Dependency-Check',
                    nvdCredentialsId: 'NVD_API_KEY',
                    additionalArguments: '''
                        --scan backend
                        --scan frontend
                        --format XML
                        --format HTML
                    '''
                )
            }
        }

        stage('Publish OWASP Report') {
            steps {
                dependencyCheckPublisher(
                    pattern: '**/dependency-check-report.xml'
                )
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
                    withSonarQubeEnv('sq1') {
                        sh '''
                            sonar-scanner \
                            -Dsonar.projectKey=mrinspecteur-frontend \
                            -Dsonar.projectName="MR Inspecteur Frontend" \
                            -Dsonar.sources=src
                        '''
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
