def CONTAINER_NAME="inventory-api-pipeline"
def CONTAINER_TAG="latest"
def CONTAINER_DB_NAME="inventory-api-db-pipeline"
def CONTAINER_DB_TAG="latest"
def OPENSHIFT_PROJECT_NAME="inventory-api-pipeline"
def OPENSHIFT_IP="172.30.1.1:5000"

node {

    stage('Checkout') {
        checkout scm
    }

    /*stage('SonarQube'){
        try {
            bat "c:\\projects\\sonar-scanner\\bin\\sonar-scanner -Dsonar.projectKey=inventoryapi -Dsonar.sources=."
        } catch(error){
            echo "The sonar server could not be reached ${error}"
        }
     }*/

    stage("Image Prune"){
        imagePrune(CONTAINER_NAME)
        imagePrune(CONTAINER_DB_NAME)
    }

    stage('DB Image Build'){
        imageBuild(CONTAINER_DB_NAME, CONTAINER_DB_TAG, "database\\")
    }

    stage('Application Image Build'){
        imageBuild(CONTAINER_NAME, CONTAINER_TAG, ".")
    }

    stage('Aqua MicroScanner for DB Image'){
        aquaMicroscanner imageName: CONTAINER_DB_NAME, notCompliesCmd: 'exit 1', onDisallowed: 'fail'
    }

    stage('Aqua MicroScanner for App Image'){
        aquaMicroscanner imageName: CONTAINER_NAME, notCompliesCmd: 'exit 1', onDisallowed: 'fail'
    }
    
    stage('Push DB to OpenShift Registry'){
        withCredentials([usernamePassword(credentialsId: 'openshift-docker-registry-account', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
            pushToImage(OPENSHIFT_IP,OPENSHIFT_PROJECT_NAME, CONTAINER_DB_NAME, CONTAINER_DB_TAG, USERNAME, PASSWORD)
        }
    }

    stage('Push App to OpenShift Registry'){
        withCredentials([usernamePassword(credentialsId: 'openshift-docker-registry-account', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
            pushToImage(OPENSHIFT_IP,OPENSHIFT_PROJECT_NAME, CONTAINER_NAME, CONTAINER_TAG, USERNAME, PASSWORD)
        }
    }
}

def imagePrune(containerName){
    try {
        bat "\"C:\\Program Files\\Docker\\Docker\\Resources\\bin\\docker\" image prune -f"
        bat "\"C:\\Program Files\\Docker\\Docker\\Resources\\bin\\docker\" stop $containerName"
    } catch(error){}
}

def imageBuild(containerName, tag, pathToDockerfile){
    bat "\"C:\\Program Files\\Docker\\Docker\\Resources\\bin\\docker\" build -t $containerName:$tag --pull --no-cache $pathToDockerfile"
    echo "Image build complete"
}

def pushToImage(openshiftIP, projectName, containerName, tag, dockerUser, dockerPassword){
    bat "\"C:\\Program Files\\Docker\\Docker\\Resources\\bin\\docker\" login -u $dockerUser -p $dockerPassword $openshiftIP"
    bat "\"C:\\Program Files\\Docker\\Docker\\Resources\\bin\\docker\" tag $containerName:$tag $openshiftIP/$projectName/$containerName:$tag"
    bat "\"C:\\Program Files\\Docker\\Docker\\Resources\\bin\\docker\" push $openshiftIP/$projectName/$containerName:$tag"
    echo "Image push complete to OpenShift"
}
