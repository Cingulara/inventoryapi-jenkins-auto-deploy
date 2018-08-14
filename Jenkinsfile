def CONTAINER_NAME="inventory-api-pipeline"
def CONTAINER_TAG="latest"
def OPENSHIFT_PROJECT_NAME="inventory-api-pipeline"
dev OPENSHIFT_IP="172.30.1.1:5000"

node {

    stage('Initialize'){
        def dockerHome = tool 'ATIS-Docker'
        def mavenHome  = tool 'ATIS-Maven'
        env.PATH = "${dockerHome}/resources/bin:${mavenHome}/bin:${env.PATH}"
    }

    stage('Checkout') {
        checkout scm
    }

    stage('SonarQube'){
        try {
            bat "c:\\projects\\sonar-scanner\\bin\\sonar-scanner -Dsonar.projectKey=inventoryapi -Dsonar.sources=."
        } catch(error){
            echo "The sonar server could not be reached ${error}"
        }
     }

    stage("Image Prune"){
        imagePrune(CONTAINER_NAME)
    }

    stage('Image Build'){
        imageBuild(CONTAINER_NAME, CONTAINER_TAG)
    }

    stage('Push to OpenShift Registry'){
        withCredentials([usernamePassword(credentialsId: 'openshift-docker-registry-account', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
            pushToImage(OPENSHIFT_IP,OPENSHIFT_PROJECT_NAME, CONTAINER_NAME, CONTAINER_TAG, USERNAME, PASSWORD)
        }
    }
}

def imagePrune(containerName){
    try {
        sh "docker image prune -f"
        sh "docker stop $containerName"
    } catch(error){}
}

def imageBuild(containerName, tag){
    sh "docker build -t $containerName:$tag  -t $containerName --pull --no-cache ."
    echo "Image build complete"
}

def pushToImage(openshiftIP, projectName, containerName, tag, dockerUser, dockerPassword){
    sh "docker login -u $dockerUser -p $dockerPassword $openshiftIP"
    sh "docker tag $containerName:$tag $openshiftIP/$projectName/$containerName:$tag"
    sh "docker push $openshiftIP/$projectName/$containerName:$tag"
    echo "Image push complete to OpenShift"
}
