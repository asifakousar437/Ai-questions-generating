$ErrorActionPreference = "Stop"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

Write-Host "Downloading OpenJDK 17..."
Invoke-WebRequest -Uri "https://github.com/adoptium/temurin17-binaries/releases/download/jdk-17.0.10%2B7/OpenJDK17U-jdk_x64_windows_hotspot_17.0.10_7.zip" -OutFile "jdk.zip"
Write-Host "Extracting OpenJDK 17..."
Expand-Archive -Path "jdk.zip" -DestinationPath "jdk_extracted" -Force

Write-Host "Downloading Maven 3.9.6..."
Invoke-WebRequest -Uri "https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip" -OutFile "maven.zip"
Write-Host "Extracting Maven..."
Expand-Archive -Path "maven.zip" -DestinationPath "maven_extracted" -Force

Write-Host "Installation Complete. Ready to run."
