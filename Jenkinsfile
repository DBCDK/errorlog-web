#!groovy

def workerNode = "devel11"

pipeline {
    agent { label workerNode }

    tools {
        jdk 'jdk11'
        maven "Maven 3"
    }

    triggers {
        upstream(upstreamProjects: "Docker-payara5-bump-trigger",
            threshold: hudson.model.Result.SUCCESS)
        pollSCM("H/03 * * * *")
    }

    options {
        timestamps()
    }

    environment {
        DOCKER_IMAGE_NAME = "docker-metascrum.artifacts.dbccloud.dk/errorlog-web"
        DOCKER_IMAGE_VERSION = "${env.BRANCH_NAME}-${env.BUILD_NUMBER}"
        DOCKER_IMAGE_DIT_VERSION = "DIT-${env.BUILD_NUMBER}"
    }

    stages {
        stage("Clean Workspace") {
            steps {
                deleteDir()
                checkout scm
            }
        }

        stage("Verify") {
            steps {
                sh "mvn verify pmd:pmd"
            }
        }

        stage("Publish PMD Results") {
            steps {
                step([$class          : 'hudson.plugins.pmd.PmdPublisher',
                      pattern         : '**/target/pmd.xml',
                      unstableTotalAll: "0",
                      failedTotalAll  : "0"])
            }
        }

        stage("Docker build") {
            when {
                expression {
                    currentBuild.result == null || currentBuild.result == 'SUCCESS'
                }
            }
            steps {
                script {
                    def image = docker.build("${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_VERSION}")
                    image.push()

                    if (env.BRANCH_NAME == 'master') {
                        sh """
                            docker tag ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_VERSION} ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_DIT_VERSION}
                            docker push ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_DIT_VERSION}
                        """
                    }
                }
            }
        }
    }

}
