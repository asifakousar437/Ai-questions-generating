$env:JAVA_HOME = "e:\Skill-based iq using ai\jdk_extracted\jdk-17.0.10+7"
$env:PATH = "$env:JAVA_HOME\bin;" + "e:\Skill-based iq using ai\maven_extracted\apache-maven-3.9.6\bin;" + $env:PATH
# cd e:\Skill-based` iq` using` ai\backend
cd "C:\Users\Asifa Kousar\Downloads\Skill-based iq using ai\Skill-based iq using ai\backend"
mvn clean spring-boot:run
