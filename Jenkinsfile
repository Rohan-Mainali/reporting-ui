pipeline {
  agent any
  environment {
     COMMIT_ID = ""
  }
  stages {
  //  def commit_id
   stage('Preparation') {
     
     steps {
       checkout scm
       //sh "rm package-lock.json"
       sh "git rev-parse --short HEAD > .git/commit-id"  
       script {
         COMMIT_ID = readFile('.git/commit-id').trim()
       }                      
     }
   }
   stage('npm build') {
     steps {
       nodejs(nodeJSInstallationName: 'nodejs16') {
        script {
          def versionData = [
            "bundle_version": COMMIT_ID
          ]
          writeJSON(file: 'src/staticdata/version.json', json: versionData)
        }
        sh 'npm ci'
	  sh 'REACT_APP_BACKEND_ENDPOINT="https://reports-api.dentira.com" REACT_APP_JSON_ENDPOINT="" REACT_APP_SESSION_ENDPOINT="https://mainapi.dentira.com" REACT_APP_SESSION_ENDPOINT_AU="https://au-api.dentira.com" REACT_APP_REDIRECT_URL_AU="https://au.dentira.com/login" REACT_APP_SESSION_ENDPOINT_CA="https://123api.dentira.com" REACT_APP_REDIRECT_URL_CA="https://canada.dentira.com/login" REACT_APP_SESSION_ENDPOINT_NZ="https://nz-api.dentira.com" REACT_APP_REDIRECT_URL_NZ="https://nz.dentira.com/login" REACT_APP_API_KEY="fb4a6b72-a08a-4331-8d95-c7046ec6cd22" REACT_APP_REDIRECT_URL="https://www.dentira.com/login" npm run build'
        script {
          // sh 'echo "{"version":"'+COMMIT_ID+'"}" > build/version.json'
          def versionData = [
            "version": COMMIT_ID
          ]
          writeJSON(file: 'build/version.json', json: versionData)
        }
        sh "ls -l build/"
       }
     }
   }
   stage('s3 upload') {
     steps {
       withAWS(region:"us-west-1", credentials:"aws_ecr") {
        s3Upload bucket: 'dentira-ui', path: 'production/reports-ui', includePathPattern:'**/*', workingDir:'build'
       }
     }
   }
   stage('invalidate cloudfront distribution') {
     steps {
       script {
          // create_cmd = """aws cloudfront create-invalidation --distribution-id E3RTR44GE1873S --paths "/*" | jq -r .Invalidation.Id"""
          // echo create_cmd 
          // INVALIDATION_ID = sh(script: create_cmd, returnStdout: true)

          // invalidate distribution and wait for finish
          // wait_cmd = """aws cloudfront wait invalidation-completed --distribution-id E3RTR44GE1873S --id $INVALIDATION_ID"""
          // sh(wait_cmd)

          withAWS(region:"us-west-1", credentials:"aws_ecr") {
            cfInvalidate(distribution:'EZJTRA1A6H5TC', paths:['/*'], waitForCompletion: true)
          }
       }
     }
   }
   
  //  stage('docker build/push') {
  //    docker.withRegistry('https://350797975535.dkr.ecr.us-west-1.amazonaws.com', 'ecr:us-west-1:ecr-credentials') {
  //      def app = docker.build("dentira-ui", "--build-arg NPM_TOKEN=${env.NPM_TOKEN} .")
  //      app.push("${commit_id}")
  //      app.push("latest")
  //    }
  //  }
  }
}
