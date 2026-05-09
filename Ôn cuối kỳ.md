# ÔN TẬP CUỐI KỲ - DEVOPS

---

## 1. DEVOPS CULTURE & PRINCIPLES

### Tóm tắt kiến thức

- **DevOps** = Development + Operations: phương pháp kết hợp giữa đội phát triển và đội vận hành
- **3 trục chính của DevOps**:
  1. **Collaboration** (Hợp tác): phá bỏ rào cản giữa Dev và Ops
  2. **Processes** (Quy trình): CI/CD, automation, agile
  3. **Tools** (Công cụ): Terraform, Docker, K8s, Jenkins...
- **Mục tiêu**: Tăng tốc độ delivery, giảm lỗi, cải thiện chất lượng phần mềm
- **Infrastructure as Code (IaC)**: quản lý hạ tầng bằng code thay vì thủ công
  - **Scripting/Imperative**: viết từng bước (how to do) - Bash, PowerShell
  - **Declarative**: mô tả trạng thái mong muốn (what to do) - Terraform, CloudFormation

### Câu hỏi trắc nghiệm

1. DevOps là sự kết hợp giữa hai bộ phận nào?
   - A. Development và Operations ✓
   - B. Design và Operations
   - C. Development và Quality Assurance
   - D. Database và Operations

2. Ba trục chính của DevOps là gì?
   - A. Code, Test, Deploy
   - B. Collaboration, Processes, Tools ✓
   - C. Plan, Build, Release
   - D. Dev, QA, Ops

3. IaC theo hướng Declarative nghĩa là gì?
   - A. Viết từng bước thực hiện
   - B. Mô tả trạng thái mong muốn của hạ tầng ✓
   - C. Sử dụng giao diện đồ họa
   - D. Viết script bash

4. Công cụ nào sau đây là Declarative IaC?
   - A. Bash script
   - B. PowerShell script
   - C. Terraform ✓
   - D. Python script

5. Mục tiêu chính của DevOps là gì?
   - A. Giảm chi phí nhân sự
   - B. Tăng tốc delivery và giảm lỗi ✓
   - C. Thay thế hoàn toàn Ops team
   - D. Chỉ tự động hóa testing

### Câu hỏi tự luận tiềm năng

1. **Trình bày khái niệm DevOps và giải thích 3 trục chính (Collaboration, Processes, Tools). Cho ví dụ cụ thể cho mỗi trục.**

2. **So sánh phương pháp Imperative và Declarative trong IaC. Nêu ưu nhược điểm và ví dụ công cụ cho mỗi loại.**

---

## 2. VERSION CONTROL - GIT

### Tóm tắt kiến thức

- **Git**: Hệ thống quản lý phiên bản phân tán (Distributed VCS)
- Tạo bởi **Linus Torvalds** năm **2005** cho Linux kernel
- **Đặc điểm**: phân tán (mỗi developer có full copy), nhanh, hỗ trợ branching tốt

#### Git Flow (Branching Model)
- **master/main**: code production, stable
- **develop**: nhánh phát triển chính
- **feature/**: tính năng mới, tách từ develop
- **release/**: chuẩn bị release, tách từ develop
- **hotfix/**: sửa lỗi khẩn cấp trên production, tách từ master

#### Lệnh Git cơ bản
```bash
git init                    # Khởi tạo repo
git clone <url>             # Clone repo
git add .                   # Stage changes
git commit -m "message"     # Commit
git push origin <branch>    # Push lên remote
git pull                    # Lấy code mới
git branch <name>           # Tạo nhánh
git checkout <branch>       # Chuyển nhánh
git merge <branch>          # Merge nhánh
```

### Câu hỏi trắc nghiệm

1. Git là loại Version Control System nào?
   - A. Centralized
   - B. Distributed ✓
   - C. Local
   - D. Cloud-based

2. Ai tạo ra Git và vào năm nào?
   - A. Bill Gates, 2000
   - B. Linus Torvalds, 2005 ✓
   - C. Mark Zuckerberg, 2010
   - D. Guido van Rossum, 2003

3. Trong Gitflow, nhánh nào chứa code production?
   - A. develop
   - B. feature
   - C. master/main ✓
   - D. release

4. Nhánh hotfix được tách ra từ nhánh nào?
   - A. develop
   - B. feature
   - C. release
   - D. master/main ✓

5. Nhánh feature được tách ra từ nhánh nào?
   - A. master
   - B. develop ✓
   - C. release
   - D. hotfix

6. Lệnh nào dùng để đưa thay đổi lên staging area?
   - A. git commit
   - B. git push
   - C. git add ✓
   - D. git pull

7. Lệnh nào kết hợp code từ nhánh khác vào nhánh hiện tại?
   - A. git branch
   - B. git merge ✓
   - C. git checkout
   - D. git clone

### Câu hỏi tự luận tiềm năng

1. **Trình bày mô hình Gitflow. Vẽ sơ đồ và giải thích vai trò của từng nhánh (master, develop, feature, release, hotfix).**

2. **So sánh Centralized VCS và Distributed VCS. Tại sao Git (DVCS) được ưa chuộng hơn trong DevOps?**

---

## 3. INFRASTRUCTURE AS CODE - TERRAFORM

### Tóm tắt kiến thức

- **Terraform**: công cụ IaC của HashiCorp, sử dụng ngôn ngữ **HCL** (HashiCorp Configuration Language)
- **Declarative**: mô tả trạng thái mong muốn, Terraform tự tìm cách đạt được
- Hỗ trợ nhiều cloud provider: AWS, Azure, GCP

#### Các lệnh quan trọng
```bash
terraform init      # Khởi tạo, tải providers
terraform plan      # Xem trước thay đổi
terraform apply     # Áp dụng thay đổi
terraform destroy   # Xóa toàn bộ resources
```

#### Cấu trúc Terraform
```hcl
# Provider
provider "azurerm" {
  features {}
}

# Resource
resource "azurerm_resource_group" "example" {
  name     = "myResourceGroup"
  location = "West Europe"
}

# Variable
variable "location" {
  default = "West Europe"
}

# Data source
data "azurerm_image" "example" {
  name                = "myImage"
  resource_group_name = "rg_images"
}
```

#### State File
- Terraform lưu trạng thái hiện tại trong file **terraform.tfstate**
- Có thể lưu remote (Azure Blob Storage, S3) để teamwork
- Dùng `terraform init -backend-config` để cấu hình remote backend

### Câu hỏi trắc nghiệm

1. Terraform sử dụng ngôn ngữ nào?
   - A. YAML
   - B. JSON
   - C. HCL ✓
   - D. XML

2. Lệnh nào xem trước thay đổi mà Terraform sẽ thực hiện?
   - A. terraform init
   - B. terraform plan ✓
   - C. terraform apply
   - D. terraform destroy

3. Lệnh nào khởi tạo Terraform và tải providers?
   - A. terraform start
   - B. terraform init ✓
   - C. terraform setup
   - D. terraform begin

4. File nào lưu trạng thái hiện tại của Terraform?
   - A. terraform.config
   - B. terraform.tfstate ✓
   - C. terraform.plan
   - D. main.tf

5. Terraform thuộc loại IaC nào?
   - A. Imperative
   - B. Declarative ✓
   - C. Scripting
   - D. Procedural

6. Lệnh nào xóa toàn bộ resources do Terraform quản lý?
   - A. terraform delete
   - B. terraform remove
   - C. terraform destroy ✓
   - D. terraform clean

7. Để bảo vệ state file trong teamwork, ta nên lưu ở đâu?
   - A. Local machine
   - B. USB drive
   - C. Remote backend (Azure Blob, S3) ✓
   - D. Email

### Câu hỏi tự luận tiềm năng

1. **Trình bày quy trình làm việc với Terraform (init → plan → apply → destroy). Giải thích vai trò của state file và tại sao cần remote backend.**

2. **Viết một đoạn Terraform code tạo một resource group trên Azure. Giải thích cấu trúc: provider, resource, variable.**

---

## 4. CONFIGURATION MANAGEMENT - ANSIBLE

### Tóm tắt kiến thức

- **Ansible**: công cụ configuration management, declarative, dùng **YAML**
- **Agentless**: không cần cài agent trên target machine (dùng SSH)
- Thành phần chính:
  - **Inventory**: danh sách các server cần quản lý
  - **Playbook**: file YAML mô tả các task cần thực hiện
  - **Modules**: đơn vị thực thi (apt, service, copy, file...)

#### Cấu trúc Playbook
```yaml
---
- hosts: webservers
  become: yes
  tasks:
    - name: Install nginx
      apt:
        name: nginx
        state: present
    - name: Start nginx service
      service:
        name: nginx
        state: started
        enabled: yes
```

#### Dynamic Inventory (Azure)
```yaml
# inv.azure_rm.yml
plugin: azure_rm
include_vm_resource_groups:
  - demoAnsible
auth_source: auto
keyed_groups:
  - key: tags.role
    leading_separator: false
```

#### Ansible Vault
- Mã hóa dữ liệu nhạy cảm (passwords, keys)
- Lệnh: `ansible-vault encrypt`, `ansible-vault decrypt`

### Câu hỏi trắc nghiệm

1. Ansible sử dụng định dạng file nào cho playbook?
   - A. JSON
   - B. XML
   - C. YAML ✓
   - D. HCL

2. Ansible kết nối tới server thông qua giao thức nào?
   - A. HTTP
   - B. FTP
   - C. SSH ✓
   - D. SNMP

3. Đặc điểm nào đúng về Ansible?
   - A. Cần cài agent trên mỗi server
   - B. Agentless - không cần cài agent ✓
   - C. Chỉ hoạt động trên Windows
   - D. Chỉ hỗ trợ static inventory

4. Module nào dùng để cài đặt package trên Ubuntu/Debian?
   - A. yum
   - B. apt ✓
   - C. pip
   - D. npm

5. Ansible Vault dùng để làm gì?
   - A. Lưu trữ backup
   - B. Mã hóa dữ liệu nhạy cảm ✓
   - C. Quản lý version
   - D. Monitor servers

6. File inventory trong Ansible chứa gì?
   - A. Mã nguồn ứng dụng
   - B. Danh sách servers cần quản lý ✓
   - C. Cấu hình network
   - D. Log files

7. Dynamic inventory trong Ansible Azure dùng plugin nào?
   - A. aws_ec2
   - B. azure_rm ✓
   - C. gcp_compute
   - D. docker_swarm

### Câu hỏi tự luận tiềm năng

1. **Trình bày Ansible và các thành phần chính (Inventory, Playbook, Modules). So sánh Ansible với các công cụ configuration management khác (Puppet, Chef).**

2. **Viết một Ansible playbook cài đặt và khởi động nginx trên nhóm servers. Giải thích từng phần của playbook.**

---

## 5. PACKER - VM IMAGE CREATION

### Tóm tắt kiến thức

- **Packer**: công cụ HashiCorp để tạo VM images tự động
- Hỗ trợ nhiều platform: Azure, AWS, GCP, VMware
- Template format: **JSON** (cũ) hoặc **HCL** (mới)

#### Cấu trúc Template JSON
```json
{
  "variables": { },
  "builders": [{ }],
  "provisioners": [{ }]
}
```

#### Cấu trúc Template HCL
```hcl
packer {
  required_plugins {
    azure = {
      version = ">= 1.0.0"
      source  = "github.com/hashicorp/azure"
    }
  }
}

variable "image_folder" {
  default = "/image"
}

source "azure-arm" "azurevm" {
  os_type  = "Linux"
  location = "West Europe"
}

build {
  sources = ["sources.azure-arm.azurevm"]
  provisioner "shell" {
    inline = ["sudo apt-get install -y nginx"]
  }
}
```

#### Lệnh Packer
```bash
packer init .           # Khởi tạo (HCL)
packer validate .       # Kiểm tra template
packer build .          # Build image
```

#### Tích hợp Packer + Terraform
```hcl
data "azurerm_image" "customnginx" {
  name                = "linuxWeb-0.0.1"
  resource_group_name = "rg_images"
}

resource "azurerm_virtual_machine" "vm" {
  storage_image_reference {
    id = data.azurerm_image.customnginx.id
  }
}
```

### Câu hỏi trắc nghiệm

1. Packer dùng để làm gì?
   - A. Quản lý containers
   - B. Tạo VM images tự động ✓
   - C. Deploy applications
   - D. Monitor servers

2. Packer template có thể viết bằng format nào?
   - A. JSON và HCL ✓
   - B. YAML và XML
   - C. Python và Ruby
   - D. Bash và PowerShell

3. Trong Packer template JSON, section nào định nghĩa platform target?
   - A. variables
   - B. builders ✓
   - C. provisioners
   - D. post-processors

4. Lệnh nào kiểm tra tính hợp lệ của Packer template?
   - A. packer check
   - B. packer validate ✓
   - C. packer verify
   - D. packer test

5. Thứ tự provisioning đúng trong IaC pipeline là gì?
   - A. Terraform → Ansible → Packer
   - B. Packer → Terraform → Ansible ✓
   - C. Ansible → Packer → Terraform
   - D. Terraform → Packer → Ansible

### Câu hỏi tự luận tiềm năng

1. **Giải thích vai trò của Packer trong IaC pipeline. Trình bày thứ tự Packer → Terraform → Ansible và giải thích tại sao.**

---

## 6. CI/CD (Continuous Integration / Continuous Delivery)

### Tóm tắt kiến thức

#### Khái niệm
- **CI (Continuous Integration)**: Tự động build + test mỗi khi có commit
- **CD (Continuous Delivery)**: Tự động deploy tới staging, cần approval để lên production
- **CD (Continuous Deployment)**: Tự động deploy hoàn toàn tới production

#### Package Managers
- **NuGet**: .NET packages
- **npm**: Node.js packages
- **Nexus**: Universal repository manager
- **Azure Artifacts**: Tích hợp trong Azure DevOps

### 6.1 Jenkins

- Open source CI/CD tool, **self-hosted** (không phải cloud service)
- **Freestyle project**: loại job cơ bản
- Trigger: **GitHub webhook** (tự động trigger khi push code)
- Build steps: Execute shell, batch command

### 6.2 Azure DevOps & Azure Pipelines

#### 5 services của Azure DevOps:
1. **Azure Repos**: Source control (Git)
2. **Azure Boards**: Project management, work items
3. **Azure Pipelines**: CI/CD pipelines
4. **Azure Artifacts**: Package management
5. **Azure Test Plans**: Manual/exploratory testing

#### Azure Pipelines - 2 modes:
- **Classic editor**: GUI-based, kéo thả tasks
- **YAML mode**: Pipeline as Code

#### CI Pipeline (Classic):
Restore → Build → Test → Publish → Publish Artifact

#### CD Pipeline (Classic):
Release pipeline với stages: CI → QA → PROD
- **Continuous deployment trigger**: tự động trigger khi CI hoàn thành

#### Azure Pipeline YAML:
```yaml
trigger:
  - master

pool:
  vmImage: ubuntu-latest

steps:
  - task: DotNetCoreCLI@2
    displayName: "Restore"
    inputs:
      command: restore
      projects: '**/*.csproj'
  - task: DotNetCoreCLI@2
    displayName: "Build"
    inputs:
      command: build
      projects: '**/*.csproj'
      arguments: '--configuration Release'
  - task: DotNetCoreCLI@2
    displayName: "Test"
    inputs:
      command: test
      projects: '**/tests/*.csproj'
```

### 6.3 GitLab CI

- File cấu hình: **.gitlab-ci.yml** (Pipeline as Code)
- Đặt ở root của repository
- Tự động trigger khi push code

```yaml
image: microsoft/dotnet:latest

stages:
  - build
  - test

variables:
  BuildConfiguration: "Release"

build:
  stage: build
  script:
    - "cd app"
    - "dotnet restore"
    - "dotnet build --configuration $BuildConfiguration"

test:
  stage: test
  script:
    - "cd tests"
    - "dotnet test --configuration $BuildConfiguration"
```

### Câu hỏi trắc nghiệm

1. CI là viết tắt của gì?
   - A. Code Integration
   - B. Continuous Integration ✓
   - C. Complete Installation
   - D. Central Infrastructure

2. Sự khác biệt giữa Continuous Delivery và Continuous Deployment?
   - A. Không có khác biệt
   - B. Delivery cần approval thủ công, Deployment tự động hoàn toàn ✓
   - C. Delivery chỉ build, Deployment chỉ test
   - D. Delivery dùng cho testing, Deployment cho production

3. Jenkins là gì?
   - A. Cloud-managed CI/CD service
   - B. Open source self-hosted CI/CD tool ✓
   - C. Package manager
   - D. Container orchestrator

4. File cấu hình pipeline của GitLab CI có tên gì?
   - A. Jenkinsfile
   - B. .gitlab-ci.yml ✓
   - C. azure-pipelines.yml
   - D. pipeline.yaml

5. Azure DevOps có bao nhiêu services chính?
   - A. 3
   - B. 4
   - C. 5 ✓
   - D. 6

6. Service nào trong Azure DevOps quản lý CI/CD pipelines?
   - A. Azure Repos
   - B. Azure Boards
   - C. Azure Pipelines ✓
   - D. Azure Artifacts

7. Trong Azure Pipelines, "Continuous deployment trigger" có nghĩa gì?
   - A. Manual trigger
   - B. Scheduled trigger
   - C. Tự động deploy khi CI build thành công ✓
   - D. Trigger bằng email

8. NuGet dùng để quản lý packages cho platform nào?
   - A. Java
   - B. Python
   - C. .NET ✓
   - D. Ruby

9. Pipeline as Code (PaC) có nghĩa là gì?
   - A. Pipeline được quản lý qua GUI
   - B. Pipeline được định nghĩa bằng file code (YAML) trong repo ✓
   - C. Pipeline chỉ chạy trên cloud
   - D. Pipeline không cần version control

10. Trigger webhook trong Jenkins có nghĩa là gì?
    - A. Chạy pipeline theo lịch
    - B. Tự động trigger khi có push lên Git repository ✓
    - C. Trigger thủ công
    - D. Trigger qua email

### Câu hỏi tự luận tiềm năng

1. **Trình bày khái niệm CI/CD. Phân biệt Continuous Integration, Continuous Delivery, và Continuous Deployment. Vẽ sơ đồ minh họa.**

2. **So sánh 3 công cụ CI/CD: Jenkins, Azure Pipelines, và GitLab CI. Nêu ưu nhược điểm và trường hợp sử dụng của từng công cụ.**

3. **Viết một pipeline YAML cho Azure DevOps để build và test một .NET application. Giải thích từng phần của file YAML.**

---

## 7. DOCKER - CONTAINERIZATION

### Tóm tắt kiến thức

#### Khái niệm
- **Docker**: công cụ containerization, open source (2013)
- **Container**: đóng gói ứng dụng + dependencies, nhẹ hơn VM
- **Container vs VM**: Container chia sẻ OS kernel, VM có OS riêng

#### Docker Architecture
- **Docker Client**: CLI để tương tác
- **Docker Daemon**: Engine thực thi
- **Docker Registry**: Kho chứa images (Docker Hub, ACR, ECR)

#### Docker Elements
- **Image**: Template read-only để tạo container
- **Container**: Instance chạy từ image
- **Volume**: Lưu trữ persistent data
- **Dockerfile**: File mô tả cách build image

#### Dockerfile Instructions
```dockerfile
FROM httpd:latest          # Base image
COPY index.html /var/www/  # Copy files vào image
ADD  file.tar.gz /app/     # Copy + extract archives
RUN  apt-get update        # Chạy lệnh khi build (tạo layer)
CMD  ["echo", "hello"]     # Lệnh mặc định khi run container
ENV  myvar=mykey           # Biến môi trường
WORKDIR /app               # Thư mục làm việc
EXPOSE 80                  # Khai báo port
ENTRYPOINT ["nginx"]       # Entry point (không bị override)
```

#### Docker Commands
```bash
docker build -t myapp:v1 .                    # Build image
docker run -d --name myapp -p 8080:80 myapp:v1  # Run container
docker ps                                      # List containers đang chạy
docker images                                  # List images
docker push myregistry/myapp:v1               # Push image
docker pull myregistry/myapp:v1               # Pull image
docker login -u <username>                     # Login registry
docker tag <imageID> <registry>/myapp:v1      # Tag image
docker stop <container>                        # Stop container
```

#### Docker Compose
- Quản lý **nhiều containers** cùng lúc
- File cấu hình: **docker-compose.yml**
- Lệnh: `docker-compose up -d`, `docker-compose down`

```yaml
version: '3'
services:
  nginx:
    image: nginx:latest
    container_name: nginx-container
    ports:
      - 8080:80
  mysql:
    image: mysql:5.7
    container_name: mysql-container
    environment:
      MYSQL_ROOT_PASSWORD: secret
      MYSQL_DATABASE: mydb
```

#### Private Registry - Azure Container Registry (ACR)
```bash
az acr create --resource-group RG-ACR --name acrdemo --sku Basic
az acr login --name demobookacr
docker tag demobook:v1 demobookacr.azurecr.io/demobook:v1
docker push demobookacr.azurecr.io/demobook:v1
```

### Câu hỏi trắc nghiệm

1. Docker ra đời năm nào?
   - A. 2010
   - B. 2013 ✓
   - C. 2015
   - D. 2017

2. Sự khác biệt chính giữa Container và VM?
   - A. Container chạy chậm hơn VM
   - B. Container chia sẻ OS kernel với host, VM có OS riêng ✓
   - C. VM nhẹ hơn Container
   - D. Container cần hypervisor

3. Trong Dockerfile, instruction nào định nghĩa base image?
   - A. RUN
   - B. CMD
   - C. FROM ✓
   - D. COPY

4. Lệnh Docker nào dùng để build image?
   - A. docker run
   - B. docker create
   - C. docker build ✓
   - D. docker start

5. Lệnh Docker nào tạo và chạy container mới?
   - A. docker start
   - B. docker run ✓
   - C. docker build
   - D. docker create

6. Docker Hub là gì?
   - A. IDE cho Docker
   - B. Public registry chứa Docker images ✓
   - C. Docker monitoring tool
   - D. Docker build server

7. Flag `-d` trong `docker run -d` có nghĩa gì?
   - A. Debug mode
   - B. Delete after stop
   - C. Detached mode (chạy background) ✓
   - D. Development mode

8. Flag `-p 8080:80` có nghĩa gì?
   - A. Port 8080 trong container map ra 80 trên host
   - B. Port 80 trong container map ra 8080 trên host ✓
   - C. Mở 2 ports: 8080 và 80
   - D. Giới hạn 8080 connections trên port 80

9. Docker Compose dùng để làm gì?
   - A. Build single image
   - B. Quản lý và deploy nhiều containers cùng lúc ✓
   - C. Monitor containers
   - D. Tạo Docker network

10. File cấu hình Docker Compose có tên gì?
    - A. Dockerfile
    - B. docker-compose.yml ✓
    - C. compose.json
    - D. docker.yaml

11. Sự khác biệt giữa RUN và CMD trong Dockerfile?
    - A. Không khác biệt
    - B. RUN thực thi khi build image, CMD thực thi khi run container ✓
    - C. RUN dùng cho Linux, CMD dùng cho Windows
    - D. CMD thực thi khi build, RUN khi run

12. ACR là viết tắt của gì?
    - A. Amazon Container Registry
    - B. Azure Container Registry ✓
    - C. Apache Container Runtime
    - D. Automated Container Repository

### Câu hỏi tự luận tiềm năng

1. **So sánh Container và Virtual Machine. Vẽ sơ đồ kiến trúc và giải thích ưu nhược điểm của mỗi loại.**

2. **Trình bày quy trình từ viết Dockerfile → build image → run container → push to registry. Viết ví dụ cụ thể cho từng bước.**

3. **Docker Compose là gì? Khi nào cần sử dụng Docker Compose? Viết một file docker-compose.yml ví dụ và giải thích.**

---

## 8. KUBERNETES - CONTAINER ORCHESTRATION

### Tóm tắt kiến thức

#### Khái niệm
- **Kubernetes (K8s)**: Container orchestration platform
- Quản lý, scale, và deploy containers trên quy mô lớn
- 2 orchestration tools phổ biến: Docker Swarm và **Kubernetes**

#### Architecture
- **Cluster** = Master + Worker Nodes
- **Master**: quản lý cluster, scheduling
- **Node** (Worker): chạy containers
- **Pod**: đơn vị nhỏ nhất, chứa 1 hoặc nhiều containers
- **kubectl**: CLI tool để tương tác với cluster

#### Kubernetes Objects (YAML)
- **apiVersion**: version API
- **kind**: loại object (Deployment, Service, Pod...)
- **metadata**: tên, labels
- **spec**: specifications

#### Deployment YAML
```yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: webapp
spec:
  selector:
    matchLabels:
      app: webapp
  replicas: 2
  template:
    metadata:
      labels:
        app: webapp
    spec:
      containers:
        - name: demobookk8s
          image: mikaelkrief/demobook:latest
          ports:
            - containerPort: 80
```

#### Service YAML (NodePort)
```yaml
---
apiVersion: v1
kind: Service
metadata:
  name: webapp
  labels:
    app: webapp
spec:
  type: NodePort
  ports:
    - port: 80
      targetPort: 80
      nodePort: 31000
  selector:
    app: webapp
```

#### kubectl Commands
```bash
kubectl apply -f myapp-deployment.yml   # Deploy/update
kubectl get pods                         # List pods
kubectl get pods,svc                     # List pods và services
kubectl get nodes                        # List nodes
kubectl logs pod/<pod-name>             # Xem logs
kubectl top nodes                        # CPU/Memory metrics
kubectl top pods                         # Pod metrics
kubectl version --short                  # Check version
```

#### Helm - Package Manager cho K8s
- **Charts**: packages chứa K8s YAML templates
- **Artifact Hub**: public Helm repository
- Commands:
```bash
helm search hub <package>       # Tìm chart
helm repo add <name> <url>      # Thêm repo
helm install <release> <chart>  # Cài chart
helm ls                         # List installed charts
helm delete <release>           # Xóa chart
helm create <name>              # Tạo custom chart
helm package .                  # Đóng gói chart
```

#### Helm Chart Structure
```
demobook/
├── charts/
├── templates/
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   └── _helpers.tpl
├── Chart.yaml
└── values.yaml
```

#### Managed Kubernetes Services
- **AKS** (Azure Kubernetes Service)
- **EKS** (Amazon Elastic Kubernetes Service)
- **GKE** (Google Kubernetes Engine)

#### AKS Advantages:
- Ready to use (dashboard pre-installed)
- Integrated monitoring
- Easy to scale

#### Monitoring K8s:
- **kubectl top** (basic metrics)
- **Kubernetes Dashboard** (web UI)
- **Prometheus** + **Grafana** (advanced monitoring)
- **Lens** / **Octant** (GUI tools)

### Câu hỏi trắc nghiệm

1. Kubernetes (K8s) dùng để làm gì?
   - A. Build Docker images
   - B. Container orchestration - quản lý containers quy mô lớn ✓
   - C. Write source code
   - D. Version control

2. Đơn vị nhỏ nhất trong Kubernetes là gì?
   - A. Container
   - B. Node
   - C. Pod ✓
   - D. Cluster

3. Công cụ CLI để tương tác với K8s cluster là gì?
   - A. docker
   - B. kubectl ✓
   - C. helm
   - D. kubeadm

4. Lệnh nào apply một deployment lên K8s?
   - A. kubectl create -f file.yml
   - B. kubectl apply -f file.yml ✓
   - C. kubectl deploy -f file.yml
   - D. kubectl run -f file.yml

5. Trong Deployment YAML, `replicas: 2` có nghĩa gì?
   - A. 2 clusters
   - B. 2 nodes
   - C. 2 pods chạy cùng ứng dụng ✓
   - D. 2 containers trong 1 pod

6. Service type `NodePort` trong K8s dùng để làm gì?
   - A. Internal communication only
   - B. Expose service ra bên ngoài cluster qua node port ✓
   - C. Load balancing giữa clusters
   - D. DNS resolution

7. Helm trong Kubernetes là gì?
   - A. Monitoring tool
   - B. Package manager cho Kubernetes ✓
   - C. Container runtime
   - D. Network plugin

8. AKS là viết tắt của gì?
   - A. Amazon Kubernetes Service
   - B. Azure Kubernetes Service ✓
   - C. Apache Kubernetes System
   - D. Automated Kubernetes Setup

9. Kiến trúc K8s gồm những thành phần chính nào?
   - A. Client và Server
   - B. Master và Worker Nodes ✓
   - C. Frontend và Backend
   - D. Database và Application

10. Lệnh nào hiển thị danh sách pods đang chạy?
    - A. kubectl list pods
    - B. kubectl show pods
    - C. kubectl get pods ✓
    - D. kubectl describe pods

11. Cài Kubernetes locally có thể dùng công cụ nào?
    - A. Docker Desktop hoặc Minikube ✓
    - B. Chỉ có thể dùng cloud
    - C. VMware Workstation
    - D. VirtualBox

12. Field `kind` trong K8s YAML là gì?
    - A. Tên của resource
    - B. Loại object (Deployment, Service, Pod...) ✓
    - C. Version API
    - D. Namespace

### Câu hỏi tự luận tiềm năng

1. **Trình bày kiến trúc Kubernetes (Master, Nodes, Pods). Vẽ sơ đồ và giải thích vai trò từng thành phần.**

2. **Viết file YAML để deploy một ứng dụng web trên Kubernetes với 3 replicas và expose qua NodePort. Giải thích từng field.**

3. **So sánh Docker Compose và Kubernetes. Khi nào dùng Docker Compose, khi nào cần Kubernetes?**

4. **Helm là gì? Tại sao cần Helm trong Kubernetes? Trình bày cấu trúc một Helm chart.**

---

## 9. MONITORING - PROMETHEUS & GRAFANA

### Tóm tắt kiến thức

- **Monitoring** là yêu cầu thiết yếu khi deploy ứng dụng trên Kubernetes
- Cần giám sát: CPU, RAM, network, application health

#### Prometheus
- Open source monitoring & alerting system
- Pull-based: thu thập metrics từ targets
- Time-series database
- Query language: **PromQL**

#### Grafana
- Open source visualization & dashboard tool
- Kết hợp với Prometheus để hiển thị metrics
- Hỗ trợ nhiều data sources
- Dashboard models cho Kubernetes

#### Monitoring Stack trong K8s:
1. **kubectl top** - basic command-line metrics
2. **Kubernetes Dashboard** - web UI
3. **Prometheus + Grafana** - full monitoring solution
4. **Lens / Octant** - desktop GUI tools
5. **AKS Insights** - Azure integrated monitoring

### Câu hỏi trắc nghiệm

1. Prometheus chủ yếu dùng để làm gì?
   - A. Container orchestration
   - B. Thu thập và lưu trữ metrics ✓
   - C. Build Docker images
   - D. Source control

2. Grafana dùng để làm gì?
   - A. Build code
   - B. Visualization và dashboard cho metrics ✓
   - C. Container runtime
   - D. Package management

3. Prometheus sử dụng mô hình thu thập dữ liệu nào?
   - A. Push-based
   - B. Pull-based ✓
   - C. Event-driven
   - D. Batch processing

4. Để xem CPU/RAM metrics của pods bằng kubectl, dùng lệnh nào?
   - A. kubectl metrics pods
   - B. kubectl top pods ✓
   - C. kubectl stats pods
   - D. kubectl monitor pods

5. Bộ đôi công cụ monitoring phổ biến nhất cho Kubernetes là?
   - A. Nagios + Zabbix
   - B. Prometheus + Grafana ✓
   - C. ELK Stack
   - D. Splunk + PagerDuty

### Câu hỏi tự luận tiềm năng

1. **Tại sao monitoring quan trọng trong DevOps/Kubernetes? Trình bày vai trò của Prometheus và Grafana trong monitoring stack.**

---

## 10. GITOPS & ArgoCD

### Tóm tắt kiến thức

- **GitOps**: phương pháp sử dụng Git làm "single source of truth" cho infrastructure và application deployment
- **Nguyên tắc GitOps**:
  1. Toàn bộ system được mô tả declaratively
  2. Trạng thái mong muốn được version trong Git
  3. Thay đổi được approved tự động áp dụng
  4. Agent đảm bảo correctness và alert nếu divergence

#### ArgoCD
- GitOps continuous delivery tool cho Kubernetes
- Tự động sync trạng thái cluster với Git repository
- Detect drift giữa desired state (Git) và actual state (K8s)
- Web UI để visualize deployments

#### Workflow:
1. Developer push code/config thay đổi vào Git
2. ArgoCD detect thay đổi
3. ArgoCD tự động sync K8s cluster với Git state
4. Nếu có drift → alert hoặc auto-reconcile

### Câu hỏi trắc nghiệm

1. GitOps sử dụng gì làm "single source of truth"?
   - A. Docker Hub
   - B. Git repository ✓
   - C. Kubernetes cluster
   - D. CI/CD server

2. ArgoCD là công cụ dùng cho?
   - A. Source control
   - B. GitOps continuous delivery cho Kubernetes ✓
   - C. Docker image building
   - D. Database management

3. Nguyên tắc cơ bản của GitOps là gì?
   - A. Imperative deployment
   - B. Manual approval for all changes
   - C. Declarative, Git-versioned, auto-applied ✓
   - D. Event-driven architecture

4. ArgoCD phát hiện "drift" nghĩa là gì?
   - A. Network latency
   - B. Sự khác biệt giữa state trong Git và state thực tế trên cluster ✓
   - C. Container crash
   - D. Git merge conflict

5. Trong GitOps workflow, ai/gì trigger deployment?
   - A. Manual SSH vào server
   - B. Git push/merge trigger ✓
   - C. Email notification
   - D. Cron job

### Câu hỏi tự luận tiềm năng

1. **GitOps là gì? Trình bày nguyên tắc của GitOps và giải thích tại sao Git được dùng làm "single source of truth". So sánh với traditional CI/CD.**

2. **ArgoCD hoạt động như thế nào? Vẽ sơ đồ workflow từ khi developer push code đến khi ứng dụng được deploy trên Kubernetes.**

---

## 11. GITHUB ACTIONS

### Tóm tắt kiến thức

- **GitHub Actions**: CI/CD platform tích hợp trực tiếp trong GitHub
- File cấu hình: `.github/workflows/<name>.yml`
- **Pipeline as Code**: YAML trong repository

#### Cấu trúc cơ bản:
```yaml
name: CI Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
```

#### Khái niệm chính:
- **Workflow**: toàn bộ pipeline
- **Job**: nhóm steps chạy trên cùng runner
- **Step**: một action hoặc shell command
- **Action**: reusable unit (marketplace)
- **Runner**: machine thực thi (GitHub-hosted hoặc self-hosted)
- **Event/Trigger**: push, pull_request, schedule, manual

### Câu hỏi trắc nghiệm

1. File workflow của GitHub Actions đặt ở đâu?
   - A. Root directory
   - B. .github/workflows/ ✓
   - C. .ci/
   - D. pipelines/

2. Trong GitHub Actions, "runner" là gì?
   - A. Git branch
   - B. Machine thực thi workflow ✓
   - C. Docker container
   - D. Test framework

3. Event nào trigger GitHub Actions workflow khi có push code?
   - A. on: commit
   - B. on: push ✓
   - C. on: deploy
   - D. on: build

4. `runs-on: ubuntu-latest` có nghĩa gì?
   - A. Deploy lên Ubuntu server
   - B. Job chạy trên Ubuntu GitHub-hosted runner ✓
   - C. Build Docker Ubuntu image
   - D. Install Ubuntu packages

5. Trong GitHub Actions, "Action" là gì?
   - A. Git commit
   - B. Reusable step/module từ marketplace ✓
   - C. Deployment target
   - D. Test result

### Câu hỏi tự luận tiềm năng

1. **So sánh GitHub Actions với Azure Pipelines và GitLab CI. Nêu ưu nhược điểm của mỗi công cụ.**

---

## 12. CLOUD PROVIDERS (AWS & Azure)

### Tóm tắt kiến thức

#### Azure Services liên quan DevOps:
- **Azure DevOps**: CI/CD platform (5 services)
- **Azure Container Registry (ACR)**: Private Docker registry
- **Azure Kubernetes Service (AKS)**: Managed K8s
- **Azure Container Instances (ACI)**: Serverless containers
- **Azure Blob Storage**: Terraform remote state

#### AWS Services liên quan DevOps:
- **AWS CodePipeline**: CI/CD
- **Amazon ECR**: Private Docker registry
- **Amazon EKS**: Managed Kubernetes
- **AWS CloudFormation**: IaC (YAML/JSON, AWS-specific)
- **Amazon S3**: Object storage, Terraform state

#### So sánh Terraform vs CloudFormation:
| | Terraform | CloudFormation |
|---|---|---|
| Provider | Multi-cloud | AWS only |
| Language | HCL | YAML/JSON |
| State | terraform.tfstate | Managed by AWS |
| Open source | Yes | No |

### Câu hỏi trắc nghiệm

1. AWS CloudFormation khác Terraform ở điểm nào?
   - A. CloudFormation chỉ hỗ trợ AWS, Terraform multi-cloud ✓
   - B. Terraform chỉ hỗ trợ Azure
   - C. CloudFormation dùng HCL
   - D. Không có khác biệt

2. Dịch vụ managed Kubernetes trên Azure gọi là gì?
   - A. EKS
   - B. GKE
   - C. AKS ✓
   - D. K8s Azure

3. Dịch vụ managed Kubernetes trên AWS gọi là gì?
   - A. AKS
   - B. EKS ✓
   - C. GKE
   - D. AWS K8s

4. ACR (Azure Container Registry) tương đương với dịch vụ nào trên AWS?
   - A. S3
   - B. ECR ✓
   - C. ECS
   - D. Lambda

---

## TỔNG HỢP CÂU HỎI TỰ LUẬN TRỌNG TÂM

1. **Trình bày DevOps là gì, 3 trục chính, và vai trò của IaC trong DevOps.**

2. **So sánh Imperative vs Declarative IaC. Cho ví dụ công cụ và use case.**

3. **Trình bày Gitflow branching model. Vẽ sơ đồ và giải thích workflow.**

4. **Terraform: giải thích workflow (init → plan → apply), state file, và remote backend.**

5. **CI/CD: phân biệt CI, Continuous Delivery, Continuous Deployment. So sánh Jenkins, Azure Pipelines, GitLab CI.**

6. **Docker: so sánh Container vs VM. Trình bày Dockerfile instructions và Docker commands cơ bản.**

7. **Kubernetes: kiến trúc (Master/Node/Pod), viết Deployment + Service YAML, giải thích replicas và NodePort.**

8. **GitOps và ArgoCD: nguyên tắc, workflow, lợi ích so với CI/CD truyền thống.**

9. **Monitoring: vai trò Prometheus + Grafana, cách monitoring ứng dụng trên Kubernetes.**

10. **Pipeline as Code: so sánh GitHub Actions, Azure Pipelines YAML, GitLab CI. Viết ví dụ pipeline.**

---

## MẸO LÀM BÀI THI

### Trắc nghiệm:
- Đọc kỹ đề, chú ý từ khóa: "KHÔNG", "ĐÚNG NHẤT", "SAI"
- Loại trừ đáp án sai rõ ràng trước
- Nhớ các acronym: IaC, CI/CD, AKS, EKS, ACR, ECR, HCL
- Nhớ tên file cấu hình: `.gitlab-ci.yml`, `docker-compose.yml`, `Dockerfile`
- Nhớ lệnh đặc trưng: `terraform plan`, `kubectl apply`, `docker build`, `helm install`

### Tự luận:
- Trả lời có cấu trúc: Định nghĩa → Giải thích → Ví dụ
- Vẽ sơ đồ khi có thể (Gitflow, K8s architecture, CI/CD pipeline)
- Viết code/YAML ví dụ ngắn gọn, đúng syntax
- So sánh bằng bảng khi đề yêu cầu compare
- Nêu use case thực tế cho mỗi công cụ
