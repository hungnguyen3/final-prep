# ÔN TẬP CHI TIẾT - LEARNING DEVOPS
## Từ cơ bản đến nâng cao, kèm ví dụ và câu hỏi ôn tập

---

# PHẦN 1: KIẾN THỨC CHI TIẾT

---

## Chương 1: Văn hóa DevOps (DevOps Culture)

### 1.1 DevOps là gì?

DevOps là sự kết hợp giữa **Development** (Phát triển) và **Operations** (Vận hành). Đây không chỉ là một bộ công cụ mà là một **văn hóa làm việc** nhằm:
- Rút ngắn vòng đời phát triển phần mềm
- Tăng tần suất triển khai (deployment frequency)
- Đảm bảo chất lượng phần mềm cao hơn

### 1.2 Ba trụ cột của DevOps (3 Axes)

#### Trụ cột 1: Collaboration (Hợp tác)
- Phá vỡ rào cản giữa team Dev và team Ops
- Chia sẻ trách nhiệm chung về sản phẩm
- Giao tiếp liên tục, minh bạch
- **Ví dụ**: Dev và Ops cùng tham gia planning meeting, cùng on-call

#### Trụ cột 2: Processes (Quy trình)
- Áp dụng phương pháp Agile/Scrum
- CI/CD (Continuous Integration / Continuous Delivery)
- Infrastructure as Code (IaC)
- Monitoring & Feedback loops
- **Ví dụ**: Mỗi commit tự động trigger build → test → deploy

#### Trụ cột 3: Tools (Công cụ)
- Automation tools: Jenkins, Azure DevOps, GitLab CI
- IaC tools: Terraform, Ansible, Packer
- Containerization: Docker, Kubernetes
- Monitoring: Prometheus, Grafana
- Version Control: Git

### 1.3 Lợi ích của DevOps
| Lợi ích | Mô tả |
|---------|-------|
| Tốc độ | Deploy nhanh hơn, từ hàng tháng → hàng ngày |
| Độ tin cậy | Tự động hóa testing, giảm lỗi con người |
| Quy mô | Quản lý infrastructure lớn dễ dàng với IaC |
| Bảo mật | DevSecOps - tích hợp security vào pipeline |

### 1.4 DevOps Lifecycle
```
Plan → Code → Build → Test → Release → Deploy → Operate → Monitor
  ↑                                                              |
  └──────────────────── Feedback ←─────────────────────────────────┘
```

---

## Chương 2: Infrastructure as Code (IaC) với Terraform

### 2.1 IaC là gì?

Infrastructure as Code là phương pháp quản lý và provisioning hạ tầng IT thông qua **code** thay vì thao tác thủ công. Mọi thay đổi đều được version control, review, và tái sử dụng.

### 2.2 Hai cách tiếp cận IaC

#### Imperative (Mệnh lệnh)
- Mô tả **CÁCH** thực hiện (step-by-step)
- Ví dụ: Scripts (Bash, PowerShell), Ansible
```bash
# Imperative: tạo VM step-by-step
az group create --name myRG --location westeurope
az vm create --resource-group myRG --name myVM --image UbuntuLTS
```

#### Declarative (Khai báo)
- Mô tả **KẾT QUẢ MONG MUỐN** (desired state)
- Ví dụ: Terraform, ARM Templates, CloudFormation
```hcl
# Declarative: khai báo trạng thái mong muốn
resource "azurerm_virtual_machine" "myvm" {
  name                = "myVM"
  location            = "West Europe"
  resource_group_name = "myRG"
  vm_size             = "Standard_DS1_v2"
}
```

### 2.3 Terraform - Tổng quan

**Terraform** là công cụ IaC mã nguồn mở của HashiCorp, sử dụng ngôn ngữ **HCL** (HashiCorp Configuration Language).

#### Đặc điểm chính:
- **Multi-cloud**: Hỗ trợ AWS, Azure, GCP, và nhiều provider khác
- **Declarative**: Khai báo desired state
- **State management**: Theo dõi trạng thái infrastructure
- **Plan before apply**: Xem trước thay đổi trước khi áp dụng

### 2.4 Cấu trúc file Terraform

```
project/
├── main.tf          # Resource definitions
├── variables.tf     # Input variables
├── outputs.tf       # Output values
├── providers.tf     # Provider configuration
├── terraform.tfvars # Variable values
└── terraform.tfstate # State file (auto-generated)
```

### 2.5 Cú pháp HCL cơ bản

#### Provider
```hcl
provider "azurerm" {
  features {}
  subscription_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

#### Resource
```hcl
resource "azurerm_resource_group" "rg" {
  name     = "myResourceGroup"
  location = "West Europe"
}
```

#### Variable
```hcl
variable "location" {
  description = "Azure region"
  type        = string
  default     = "West Europe"
}
```

#### Output
```hcl
output "resource_group_id" {
  value = azurerm_resource_group.rg.id
}
```

#### Data Source (đọc resource có sẵn)
```hcl
data "azurerm_resource_group" "existing" {
  name = "existing-rg"
}
```

### 2.6 Terraform Workflow (Các lệnh chính)

```bash
# 1. Khởi tạo - download providers
terraform init

# 2. Xem trước thay đổi
terraform plan

# 3. Áp dụng thay đổi
terraform apply

# 4. Xóa toàn bộ infrastructure
terraform destroy
```

#### Chi tiết từng lệnh:

| Lệnh | Mục đích |
|------|----------|
| `terraform init` | Download provider plugins, khởi tạo backend |
| `terraform plan` | So sánh desired state với current state, hiện preview |
| `terraform apply` | Thực thi thay đổi (tạo/sửa/xóa resources) |
| `terraform destroy` | Xóa toàn bộ resources đã tạo |
| `terraform fmt` | Format code HCL |
| `terraform validate` | Kiểm tra syntax |
| `terraform state list` | Liệt kê resources trong state |

### 2.7 Terraform State

- **State file** (`terraform.tfstate`): Lưu trạng thái hiện tại của infrastructure
- Terraform so sánh state file với configuration để xác định thay đổi cần thực hiện
- **QUAN TRỌNG**: Không nên lưu state file trên local cho team project

#### Remote Backend (lưu state trên cloud)
```hcl
terraform {
  backend "azurerm" {
    resource_group_name  = "tfstate-rg"
    storage_account_name = "tfstatestorage"
    container_name       = "tfstate"
    key                  = "terraform.tfstate"
  }
}
```

### 2.8 Terraform nâng cao

#### Provisioner (chạy script sau khi tạo resource)
```hcl
resource "azurerm_virtual_machine" "vm" {
  # ... config ...

  provisioner "remote-exec" {
    inline = [
      "sudo apt-get update",
      "sudo apt-get install -y nginx"
    ]
  }
}
```

#### Module (tái sử dụng code)
```hcl
module "network" {
  source         = "./modules/network"
  vnet_name      = "myVnet"
  address_space  = ["10.0.0.0/16"]
}
```

#### Ví dụ hoàn chỉnh: Tạo Web App trên Azure
```hcl
provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = "webapp-rg"
  location = "West Europe"
}

resource "azurerm_app_service_plan" "plan" {
  name                = "webapp-plan"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  sku {
    tier = "Standard"
    size = "S1"
  }
}

resource "azurerm_app_service" "app" {
  name                = "my-webapp-demo"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  app_service_plan_id = azurerm_app_service_plan.plan.id
}
```

---

## Chương 3: Version Control với Git

### 3.1 Git là gì?

Git là hệ thống **Distributed Version Control System (DVCS)** — quản lý phiên bản phân tán. Mỗi developer có một bản sao đầy đủ (clone) của repository trên máy local.

### 3.2 Tại sao dùng Git trong DevOps?

- **Collaboration**: Nhiều người làm việc đồng thời
- **Traceability**: Theo dõi ai thay đổi gì, khi nào
- **Branching**: Phát triển tính năng song song
- **CI/CD Integration**: Trigger pipeline từ git events

### 3.3 Các khái niệm cơ bản

| Khái niệm | Mô tả |
|-----------|-------|
| Repository | Kho chứa code và lịch sử thay đổi |
| Commit | Snapshot của code tại một thời điểm |
| Branch | Nhánh phát triển độc lập |
| Merge | Gộp thay đổi từ branch khác |
| Clone | Sao chép repo từ remote về local |
| Pull | Lấy thay đổi mới từ remote |
| Push | Đẩy thay đổi lên remote |
| Tag | Đánh dấu một commit quan trọng (version) |

### 3.4 Các lệnh Git thường dùng

```bash
# Khởi tạo repo
git init
git clone https://github.com/user/repo.git

# Thao tác cơ bản
git status                    # Xem trạng thái
git add .                     # Stage tất cả thay đổi
git add file.txt              # Stage file cụ thể
git commit -m "message"       # Commit
git push origin main          # Push lên remote
git pull origin main          # Pull về local

# Branch
git branch feature/login      # Tạo branch
git checkout feature/login    # Chuyển branch
git checkout -b feature/new   # Tạo + chuyển branch
git merge feature/login       # Merge branch vào current branch
git branch -d feature/login   # Xóa branch đã merge

# Xem lịch sử
git log                       # Xem commit history
git log --oneline --graph     # Xem dạng đồ thị
git diff                      # Xem thay đổi chưa stage
git blame file.txt            # Xem ai sửa dòng nào

# Hoàn tác
git reset --soft HEAD~1       # Undo commit, giữ changes
git reset --hard HEAD~1       # Undo commit, XÓA changes
git revert <commit-hash>      # Tạo commit đảo ngược
git stash                     # Lưu tạm thay đổi
git stash pop                 # Lấy lại thay đổi đã stash
```

### 3.5 Gitflow Workflow

Gitflow là mô hình branching phổ biến nhất cho team:

```
                    hotfix/xxx
                   /          \
master ─────●─────●────────────●─────●──── (production releases)
             \                      /
              \   release/1.0      /
               \ /            \   /
develop ────●───●───●───●──────●─●──── (integration branch)
            |       |
         feature/ feature/
         login    payment
```

#### Các nhánh trong Gitflow:

| Branch | Mục đích | Tạo từ | Merge vào |
|--------|----------|--------|-----------|
| `master/main` | Code production, luôn stable | - | - |
| `develop` | Integration branch, code mới nhất | master | master (qua release) |
| `feature/*` | Phát triển tính năng mới | develop | develop |
| `release/*` | Chuẩn bị release (bug fix, docs) | develop | master + develop |
| `hotfix/*` | Fix bug khẩn cấp trên production | master | master + develop |

#### Quy trình Gitflow:
1. Developer tạo `feature/xxx` từ `develop`
2. Hoàn thành → merge vào `develop`
3. Sẵn sàng release → tạo `release/1.0` từ `develop`
4. Test, fix bug trên release branch
5. Merge `release/1.0` vào `master` (tag version) và `develop`
6. Nếu có bug production → tạo `hotfix/xxx` từ `master`

### 3.6 Pull Request / Merge Request

- Cơ chế **code review** trước khi merge
- Cho phép team review, comment, approve
- Tích hợp với CI: auto-run tests khi tạo PR
- Best practices:
  - PR nhỏ, focused vào 1 feature/fix
  - Mô tả rõ ràng thay đổi
  - Assign reviewer phù hợp

### 3.7 Git Hooks

Git hooks là scripts tự động chạy khi có events:
- `pre-commit`: Chạy trước commit (lint, format)
- `pre-push`: Chạy trước push (tests)
- `post-merge`: Chạy sau merge

```bash
# .git/hooks/pre-commit
#!/bin/sh
npm run lint
```

---

## Chương 4: Ansible - Configuration Management

### 4.1 Ansible là gì?

Ansible là công cụ **Configuration Management** và **automation** mã nguồn mở của Red Hat.

#### Đặc điểm quan trọng:
- **Agentless**: KHÔNG cần cài agent trên target servers (dùng SSH)
- **YAML-based**: Viết playbook bằng YAML, dễ đọc
- **Idempotent**: Chạy nhiều lần cho kết quả giống nhau
- **Push-based**: Control node push config đến managed nodes

### 4.2 Kiến trúc Ansible

```
┌─────────────────┐
│  Control Node   │ (máy chạy Ansible)
│  - Playbooks    │
│  - Inventory    │
│  - Modules      │
└────────┬────────┘
         │ SSH
    ┌────┼────┐
    ▼    ▼    ▼
┌─────┐┌─────┐┌─────┐
│Node1││Node2││Node3│  (Managed Nodes)
└─────┘└─────┘└─────┘
```

### 4.3 Inventory (Danh sách hosts)

#### Static Inventory (`inventory.ini`)
```ini
[webservers]
web1.example.com
web2.example.com ansible_port=2222

[databases]
db1.example.com
db2.example.com

[all:vars]
ansible_user=admin
ansible_ssh_private_key_file=~/.ssh/id_rsa
```

#### Dynamic Inventory
- Tự động lấy danh sách hosts từ cloud provider (AWS, Azure, GCP)
- Sử dụng scripts hoặc plugins
```bash
ansible-inventory -i azure_rm.yml --list
```

### 4.4 Playbook

Playbook là file YAML mô tả các tasks cần thực hiện:

```yaml
---
- name: Configure web servers
  hosts: webservers
  become: yes  # Run as root (sudo)

  vars:
    http_port: 80
    doc_root: /var/www/html

  tasks:
    - name: Install nginx
      apt:
        name: nginx
        state: present
        update_cache: yes

    - name: Start nginx service
      service:
        name: nginx
        state: started
        enabled: yes

    - name: Copy index.html
      copy:
        src: files/index.html
        dest: "{{ doc_root }}/index.html"
        owner: www-data
        mode: '0644'
      notify: Restart nginx

  handlers:
    - name: Restart nginx
      service:
        name: nginx
        state: restarted
```

### 4.5 Các thành phần quan trọng

#### Modules (Các module phổ biến)
| Module | Mục đích | Ví dụ |
|--------|----------|-------|
| `apt`/`yum` | Quản lý packages | `apt: name=nginx state=present` |
| `service` | Quản lý services | `service: name=nginx state=started` |
| `copy` | Copy file | `copy: src=app.conf dest=/etc/app.conf` |
| `template` | Copy với biến Jinja2 | `template: src=nginx.j2 dest=/etc/nginx/nginx.conf` |
| `file` | Quản lý files/dirs | `file: path=/data state=directory` |
| `command` | Chạy command | `command: ls -la /tmp` |
| `shell` | Chạy shell command | `shell: echo $HOME` |
| `git` | Git operations | `git: repo=url dest=/app` |
| `user` | Quản lý users | `user: name=deploy state=present` |

#### Roles (Tổ chức code)
```
roles/
└── webserver/
    ├── tasks/
    │   └── main.yml
    ├── handlers/
    │   └── main.yml
    ├── templates/
    │   └── nginx.conf.j2
    ├── files/
    │   └── index.html
    ├── vars/
    │   └── main.yml
    └── defaults/
        └── main.yml
```

#### Sử dụng Role trong Playbook:
```yaml
---
- hosts: webservers
  roles:
    - webserver
    - database
```

### 4.6 Ansible Vault (Bảo mật)

Mã hóa dữ liệu nhạy cảm (passwords, API keys):

```bash
# Tạo file encrypted
ansible-vault create secrets.yml

# Encrypt file có sẵn
ansible-vault encrypt vars.yml

# Decrypt
ansible-vault decrypt vars.yml

# Chạy playbook với vault
ansible-playbook site.yml --ask-vault-pass
```

### 4.7 Chạy Ansible

```bash
# Ad-hoc command (lệnh đơn)
ansible webservers -m ping
ansible all -m shell -a "uptime"
ansible webservers -m apt -a "name=nginx state=present" --become

# Chạy playbook
ansible-playbook -i inventory.ini playbook.yml
ansible-playbook playbook.yml --limit webservers
ansible-playbook playbook.yml --tags "install"
```

---

## Chương 5: Packer - Tạo VM Images

### 5.1 Packer là gì?

Packer là công cụ của HashiCorp để tạo **machine images** (VM images) tự động và nhất quán cho nhiều platform.

#### Tại sao cần Packer?
- Tạo "golden image" với mọi phần mềm đã cài sẵn
- VM khởi động nhanh (không cần cài đặt khi runtime)
- Đảm bảo consistency giữa các environment
- Tích hợp với Terraform để deploy images

### 5.2 Kiến trúc Packer Template

#### JSON Format (legacy)
```json
{
  "variables": {
    "image_folder": "/image"
  },
  "builders": [
    {
      "type": "azure-arm",
      "os_type": "Linux",
      "location": "West Europe",
      "vm_size": "Standard_DS2_v2"
    }
  ],
  "provisioners": [
    {
      "type": "shell",
      "inline": [
        "apt-get update",
        "apt-get install -y nginx"
      ]
    }
  ]
}
```

#### HCL Format (khuyên dùng - từ Packer 1.7+)
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
  type    = string
  default = "/image"
}

source "azure-arm" "azurevm" {
  os_type                   = "Linux"
  location                  = "West Europe"
  vm_size                   = "Standard_DS2_v2"
  image_publisher           = "Canonical"
  image_offer               = "UbuntuServer"
  image_sku                 = "18.04-LTS"
  managed_image_name        = "myPackerImage"
  managed_image_resource_group_name = "packer-rg"
}

build {
  sources = ["sources.azure-arm.azurevm"]

  provisioner "shell" {
    inline = [
      "apt-get update",
      "apt-get install -y nginx"
    ]
  }

  provisioner "file" {
    source      = "config/nginx.conf"
    destination = "/etc/nginx/nginx.conf"
  }
}
```

### 5.3 Ba thành phần chính

| Thành phần | Mục đích |
|-----------|----------|
| **Builders** | Định nghĩa platform đích (Azure, AWS, VMware, Docker) |
| **Provisioners** | Cài đặt/cấu hình phần mềm (shell, ansible, file) |
| **Variables** | Tham số hóa template |

### 5.4 Provisioner Types

```hcl
# Shell provisioner
provisioner "shell" {
  inline = ["apt-get update", "apt-get install -y nginx"]
}

# File provisioner
provisioner "file" {
  source      = "app/"
  destination = "/opt/app/"
}

# Ansible provisioner (dùng Ansible trong Packer)
provisioner "ansible" {
  playbook_file = "playbook.yml"
}
```

### 5.5 Packer Commands

```bash
# Validate template
packer validate template.pkr.hcl

# Build image
packer build template.pkr.hcl

# Build với variables
packer build -var "image_name=myapp-v1" template.pkr.hcl
```

### 5.6 Packer + Terraform Integration

1. **Packer** tạo image → lưu image ID
2. **Terraform** dùng image ID để tạo VM

```hcl
# Terraform sử dụng image do Packer tạo
data "azurerm_image" "packer" {
  name                = "myPackerImage"
  resource_group_name = "packer-rg"
}

resource "azurerm_virtual_machine" "vm" {
  # ...
  storage_image_reference {
    id = data.azurerm_image.packer.id
  }
}
```

---

## Chương 6: CI/CD - Continuous Integration & Continuous Delivery

### 6.1 Khái niệm CI/CD

#### Continuous Integration (CI)
- Developers merge code vào shared repository **thường xuyên** (nhiều lần/ngày)
- Mỗi merge trigger tự động: **Build → Test**
- Phát hiện lỗi sớm, giảm integration conflicts
- Quy tắc: "Commit early, commit often"

#### Continuous Delivery (CD)
- Mở rộng CI: code luôn ở trạng thái **sẵn sàng deploy**
- Deploy lên staging/production chỉ cần 1 click (manual approval)
- Tự động hóa toàn bộ pipeline trừ bước cuối

#### Continuous Deployment
- Tự động deploy mọi thay đổi đã pass tests lên production
- KHÔNG cần manual approval
- Yêu cầu test coverage cao và monitoring tốt

```
Code → Build → Unit Test → Integration Test → Deploy Staging → Deploy Prod
|←── CI ──→|                                                       |
|←────────────── Continuous Delivery ─────────────────→| (manual)  |
|←────────────── Continuous Deployment ────────────────────────────→| (auto)
```

### 6.2 Jenkins

#### Tổng quan
- CI/CD server mã nguồn mở, phổ biến nhất
- Viết bằng Java, chạy trên mọi platform
- Hệ sinh thái plugins khổng lồ (1000+)
- Hỗ trợ Pipeline as Code (Jenkinsfile)

#### Jenkinsfile (Declarative Pipeline)
```groovy
pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'myapp'
        VERSION = '1.0.0'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/user/repo.git'
            }
        }

        stage('Build') {
            steps {
                sh 'mvn clean package'
            }
        }

        stage('Test') {
            steps {
                sh 'mvn test'
            }
            post {
                always {
                    junit 'target/surefire-reports/*.xml'
                }
            }
        }

        stage('Docker Build') {
            steps {
                sh "docker build -t ${DOCKER_IMAGE}:${VERSION} ."
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                sh "docker push ${DOCKER_IMAGE}:${VERSION}"
                sh './deploy.sh'
            }
        }
    }

    post {
        failure {
            mail to: 'team@company.com',
                 subject: "Pipeline Failed: ${currentBuild.fullDisplayName}",
                 body: "Check: ${env.BUILD_URL}"
        }
    }
}
```

### 6.3 Azure DevOps

Azure DevOps gồm **5 dịch vụ**:

| Dịch vụ | Mục đích |
|---------|----------|
| **Azure Boards** | Quản lý work items, sprints (Agile/Scrum) |
| **Azure Repos** | Git repositories |
| **Azure Pipelines** | CI/CD pipelines |
| **Azure Test Plans** | Manual/automated testing |
| **Azure Artifacts** | Package management (NuGet, npm, Maven) |

#### Azure Pipelines - Classic (GUI-based)
- Tạo pipeline bằng giao diện kéo-thả
- Phù hợp người mới bắt đầu
- Build pipeline + Release pipeline riêng biệt

#### Azure Pipelines - YAML
```yaml
trigger:
  branches:
    include:
      - main
      - develop

pool:
  vmImage: 'ubuntu-latest'

variables:
  buildConfiguration: 'Release'

stages:
  - stage: Build
    jobs:
      - job: BuildJob
        steps:
          - task: UseDotNet@2
            inputs:
              version: '6.0.x'

          - script: dotnet build --configuration $(buildConfiguration)
            displayName: 'Build project'

          - script: dotnet test --no-build
            displayName: 'Run tests'

          - task: PublishBuildArtifacts@1
            inputs:
              pathToPublish: '$(Build.ArtifactStagingDirectory)'
              artifactName: 'drop'

  - stage: Deploy
    dependsOn: Build
    condition: succeeded()
    jobs:
      - deployment: DeployToStaging
        environment: 'staging'
        strategy:
          runOnce:
            deploy:
              steps:
                - script: echo "Deploying to staging"
```

### 6.4 GitLab CI/CD

#### File cấu hình: `.gitlab-ci.yml`
```yaml
image: node:18

stages:
  - build
  - test
  - deploy

variables:
  NODE_ENV: production

cache:
  paths:
    - node_modules/

before_script:
  - npm install

build:
  stage: build
  script:
    - npm run build
  artifacts:
    paths:
      - dist/

test:
  stage: test
  script:
    - npm run test
  coverage: '/Coverage: (\d+\.\d+)%/'

deploy_staging:
  stage: deploy
  script:
    - npm run deploy:staging
  environment:
    name: staging
    url: https://staging.example.com
  only:
    - develop

deploy_production:
  stage: deploy
  script:
    - npm run deploy:prod
  environment:
    name: production
    url: https://www.example.com
  only:
    - main
  when: manual  # Requires manual trigger
```

#### Khái niệm GitLab CI:
- **Stages**: Các giai đoạn (build, test, deploy)
- **Jobs**: Các task trong mỗi stage
- **Runners**: Agents thực thi jobs
- **Artifacts**: Output của job, dùng cho job sau
- **Cache**: Lưu dependencies giữa các runs
- **Environments**: Staging, production
- **Only/Except**: Điều kiện chạy job

### 6.5 GitHub Actions

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - run: npm ci
      - run: npm run build
      - run: npm test

  deploy:
    needs: build-and-test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to production
        run: ./deploy.sh
        env:
          DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
```

### 6.6 So sánh CI/CD Tools

| Feature | Jenkins | Azure Pipelines | GitLab CI | GitHub Actions |
|---------|---------|----------------|-----------|----------------|
| Hosting | Self-hosted | Cloud/Self | Cloud/Self | Cloud |
| Config | Jenkinsfile | YAML | .gitlab-ci.yml | YAML |
| Free tier | Unlimited | 1800 min/month | 400 min/month | 2000 min/month |
| Plugins | 1000+ | Extensions | Built-in | Marketplace |
| Container | Docker | Docker/VM | Docker | Docker/VM |

---

## Chương 7: Docker - Containerization

### 7.1 Docker là gì?

Docker là platform để **build, ship, run** applications trong **containers**. Container là môi trường cô lập, nhẹ, chứa mọi thứ cần thiết để chạy ứng dụng.

### 7.2 Container vs Virtual Machine

```
┌──────────────────────┐    ┌──────────────────────┐
│  Container Model     │    │     VM Model         │
├──────────────────────┤    ├──────────────────────┤
│ App A │ App B │ App C│    │ App A │ App B │ App C│
│ Libs  │ Libs  │ Libs │    │ Libs  │ Libs  │ Libs │
├───────┴───────┴──────┤    │  OS   │  OS   │  OS  │
│    Docker Engine      │    ├───────┴───────┴──────┤
├──────────────────────┤    │      Hypervisor       │
│     Host OS          │    ├──────────────────────┤
├──────────────────────┤    │      Host OS          │
│     Hardware         │    ├──────────────────────┤
└──────────────────────┘    │      Hardware         │
                            └──────────────────────┘
```

| Đặc điểm | Container | VM |
|-----------|-----------|-----|
| Kích thước | MB | GB |
| Khởi động | Giây | Phút |
| Isolation | Process-level | Full OS |
| OS | Chia sẻ kernel host | OS riêng |
| Hiệu năng | Gần native | Overhead từ hypervisor |

### 7.3 Dockerfile

Dockerfile là file text chứa instructions để build Docker image.

#### Các instruction quan trọng:

| Instruction | Mô tả |
|-------------|--------|
| `FROM` | Base image (bắt buộc, dòng đầu tiên) |
| `RUN` | Chạy command khi build image |
| `COPY` | Copy files từ host vào image |
| `ADD` | Giống COPY + hỗ trợ URL và auto-extract tar |
| `WORKDIR` | Set working directory |
| `ENV` | Set environment variable |
| `EXPOSE` | Khai báo port (documentation) |
| `CMD` | Command mặc định khi run container (có thể override) |
| `ENTRYPOINT` | Command cố định khi run container |
| `ARG` | Build-time variable |
| `VOLUME` | Mount point cho data persistence |
| `LABEL` | Metadata cho image |
| `MULTI-STAGE` | Giảm image size bằng cách build trong nhiều stages |

#### Ví dụ Dockerfile cho Node.js app:
```dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

#### Ví dụ Dockerfile cho Python app:
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
ENTRYPOINT ["python"]
CMD ["app.py"]
```

#### CMD vs ENTRYPOINT:
```dockerfile
# CMD: có thể override khi docker run
CMD ["python", "app.py"]
# docker run myimage python other.py  ← override CMD

# ENTRYPOINT: không thể override (trừ --entrypoint)
ENTRYPOINT ["python"]
CMD ["app.py"]
# docker run myimage other.py  ← chạy "python other.py"
```

### 7.4 Docker Commands

```bash
# Build image
docker build -t myapp:1.0 .
docker build -t myapp:1.0 -f Dockerfile.prod .

# Run container
docker run -d --name myapp -p 8080:3000 myapp:1.0
docker run -it --rm ubuntu:22.04 bash
docker run -d -v /host/data:/container/data myapp:1.0
docker run -d -e DB_HOST=localhost -e DB_PORT=5432 myapp:1.0

# Container management
docker ps                    # List running containers
docker ps -a                 # List all containers
docker stop myapp            # Stop container
docker start myapp           # Start stopped container
docker rm myapp              # Remove container
docker logs myapp            # View logs
docker exec -it myapp bash   # Execute command in container

# Image management
docker images                # List images
docker rmi myapp:1.0         # Remove image
docker pull nginx:latest     # Pull from registry
docker push user/myapp:1.0   # Push to registry
docker tag myapp:1.0 user/myapp:latest

# Registry (Docker Hub, ACR)
docker login
docker login myacr.azurecr.io
docker push myacr.azurecr.io/myapp:1.0
```

### 7.5 Docker Compose

Docker Compose cho phép định nghĩa và chạy **multi-container** applications.

#### File `docker-compose.yml`:
```yaml
version: '3.8'

services:
  web:
    build: ./web
    ports:
      - "8080:80"
    environment:
      - DB_HOST=database
      - DB_PORT=5432
    depends_on:
      - database
      - redis
    networks:
      - app-network
    restart: always

  database:
    image: postgres:14
    volumes:
      - db-data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secret
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    networks:
      - app-network

  nginx:
    image: nginx:latest
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - web
    networks:
      - app-network

volumes:
  db-data:

networks:
  app-network:
    driver: bridge
```

#### Docker Compose Commands:
```bash
docker-compose up -d          # Start all services (detached)
docker-compose down           # Stop and remove containers
docker-compose build          # Build images
docker-compose logs -f web    # Follow logs of 'web' service
docker-compose ps             # List services
docker-compose exec web bash  # Exec into service
docker-compose scale web=3    # Scale service
```

### 7.6 Azure Container Registry (ACR) & Azure Container Instances (ACI)

#### ACR - Private Docker Registry
```bash
# Tạo ACR
az acr create --resource-group myRG --name myacr --sku Basic

# Login
az acr login --name myacr

# Push image
docker tag myapp:1.0 myacr.azurecr.io/myapp:1.0
docker push myacr.azurecr.io/myapp:1.0
```

#### ACI - Chạy container không cần quản lý VM
```bash
# Deploy container
az container create \
  --resource-group myRG \
  --name myapp-container \
  --image myacr.azurecr.io/myapp:1.0 \
  --ports 80 \
  --cpu 1 --memory 1.5
```

#### Terraform cho ACI:
```hcl
resource "azurerm_container_group" "aci" {
  name                = "aci-myapp"
  location            = "West Europe"
  resource_group_name = azurerm_resource_group.rg.name
  os_type             = "Linux"

  container {
    name   = "myapp"
    image  = "myacr.azurecr.io/myapp:1.0"
    cpu    = "0.5"
    memory = "1.5"

    ports {
      port     = 80
      protocol = "TCP"
    }
  }
}
```

### 7.7 Best Practices Dockerfile
1. Dùng `.dockerignore` để exclude files không cần thiết
2. Sử dụng multi-stage builds để giảm image size
3. Đặt instruction ít thay đổi lên trước (tận dụng cache)
4. Dùng specific tag thay vì `latest`
5. Không chạy container với root user
6. Gộp RUN commands để giảm layers

```dockerfile
# .dockerignore
node_modules
.git
*.md
.env
```

---

## Chương 8: Kubernetes (K8s) - Container Orchestration

### 8.1 Kubernetes là gì?

Kubernetes (K8s) là hệ thống **container orchestration** mã nguồn mở, tự động hóa việc deploy, scale, và quản lý containerized applications.

#### Vấn đề Kubernetes giải quyết:
- Triển khai containers trên nhiều servers
- Auto-scaling theo traffic
- Self-healing (restart containers bị lỗi)
- Load balancing
- Rolling updates & rollbacks
- Service discovery

### 8.2 Kiến trúc Kubernetes

```
┌─────────────────────────────────────────────────────────┐
│                    MASTER NODE (Control Plane)           │
│  ┌──────────┐ ┌───────────┐ ┌──────────┐ ┌──────────┐ │
│  │ API      │ │ Scheduler │ │Controller│ │  etcd    │ │
│  │ Server   │ │           │ │ Manager  │ │(key-val) │ │
│  └──────────┘ └───────────┘ └──────────┘ └──────────┘ │
└────────────────────────┬────────────────────────────────┘
                         │ kubectl / API
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ WORKER NODE │  │ WORKER NODE │  │ WORKER NODE │
│ ┌────┐┌────┐│  │ ┌────┐┌────┐│  │ ┌────┐┌────┐│
│ │Pod ││Pod ││  │ │Pod ││Pod ││  │ │Pod ││Pod ││
│ └────┘└────┘│  │ └────┘└────┘│  │ └────┘└────┘│
│ ┌──────────┐│  │ ┌──────────┐│  │ ┌──────────┐│
│ │  kubelet ││  │ │  kubelet ││  │ │  kubelet ││
│ │kube-proxy││  │ │kube-proxy││  │ │kube-proxy││
│ └──────────┘│  │ └──────────┘│  │ └──────────┘│
└─────────────┘  └─────────────┘  └─────────────┘
```

#### Master Node Components:
| Component | Mục đích |
|-----------|----------|
| **API Server** | Entry point cho mọi request (REST API) |
| **Scheduler** | Quyết định Pod chạy trên Node nào |
| **Controller Manager** | Đảm bảo desired state = actual state |
| **etcd** | Key-value store lưu cluster state |

#### Worker Node Components:
| Component | Mục đích |
|-----------|----------|
| **kubelet** | Agent trên mỗi node, quản lý pods |
| **kube-proxy** | Network proxy, load balancing |
| **Container Runtime** | Docker/containerd để chạy containers |

### 8.3 Kubernetes Objects

#### Pod (đơn vị nhỏ nhất)
- Chứa 1 hoặc nhiều containers
- Chia sẻ network namespace và storage
- Có IP riêng trong cluster

#### Deployment (quản lý Pods)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: webapp
  labels:
    app: webapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: webapp
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      labels:
        app: webapp
    spec:
      containers:
        - name: webapp
          image: myacr.azurecr.io/webapp:1.0
          ports:
            - containerPort: 80
          resources:
            requests:
              cpu: "100m"
              memory: "128Mi"
            limits:
              cpu: "500m"
              memory: "256Mi"
          livenessProbe:
            httpGet:
              path: /health
              port: 80
            initialDelaySeconds: 10
            periodSeconds: 5
```

#### Service (expose Pods ra network)
```yaml
apiVersion: v1
kind: Service
metadata:
  name: webapp-service
spec:
  type: NodePort
  selector:
    app: webapp
  ports:
    - port: 80
      targetPort: 80
      nodePort: 31000
```

#### Service Types:
| Type | Mô tả |
|------|--------|
| **ClusterIP** | Internal only (default) |
| **NodePort** | Expose qua port trên mỗi Node (30000-32767) |
| **LoadBalancer** | Cloud load balancer (external IP) |
| **ExternalName** | DNS CNAME mapping |

#### ConfigMap & Secret
```yaml
# ConfigMap
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  DB_HOST: "postgres-service"
  DB_PORT: "5432"

---
# Secret
apiVersion: v1
kind: Secret
metadata:
  name: app-secret
type: Opaque
data:
  DB_PASSWORD: cGFzc3dvcmQxMjM=  # base64 encoded
```

#### Sử dụng ConfigMap/Secret trong Pod:
```yaml
spec:
  containers:
    - name: webapp
      image: myapp:1.0
      envFrom:
        - configMapRef:
            name: app-config
        - secretRef:
            name: app-secret
```

### 8.4 kubectl Commands

```bash
# Cluster info
kubectl cluster-info
kubectl get nodes

# Deployments
kubectl apply -f deployment.yaml
kubectl get deployments
kubectl describe deployment webapp
kubectl scale deployment webapp --replicas=5
kubectl rollout status deployment/webapp
kubectl rollout undo deployment/webapp

# Pods
kubectl get pods
kubectl get pods -o wide
kubectl describe pod <pod-name>
kubectl logs <pod-name>
kubectl exec -it <pod-name> -- bash
kubectl delete pod <pod-name>

# Services
kubectl get services
kubectl expose deployment webapp --type=NodePort --port=80

# Namespace
kubectl get namespaces
kubectl create namespace dev
kubectl get pods -n dev

# Apply/Delete resources
kubectl apply -f .             # Apply all YAML in directory
kubectl delete -f service.yaml
```

### 8.5 Helm - Package Manager cho Kubernetes

#### Helm là gì?
- "apt/yum cho Kubernetes"
- Quản lý **Charts** (packages of K8s resources)
- Hỗ trợ templating, versioning, rollback

#### Helm Commands:
```bash
# Add repository
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# Search charts
helm search repo nginx
helm search hub wordpress

# Install chart
helm install my-nginx bitnami/nginx
helm install my-app ./mychart --values custom-values.yaml

# Manage releases
helm list
helm status my-nginx
helm upgrade my-nginx bitnami/nginx --set replicaCount=3
helm rollback my-nginx 1
helm uninstall my-nginx
```

#### Custom Helm Chart Structure:
```
mychart/
├── Chart.yaml          # Chart metadata
├── values.yaml         # Default values
├── templates/
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── configmap.yaml
│   └── _helpers.tpl
└── charts/             # Dependencies
```

#### Chart.yaml:
```yaml
apiVersion: v2
name: myapp
description: My application Helm chart
version: 1.0.0
appVersion: "2.0"
```

#### values.yaml:
```yaml
replicaCount: 3
image:
  repository: myacr.azurecr.io/myapp
  tag: "1.0"
  pullPolicy: IfNotPresent
service:
  type: LoadBalancer
  port: 80
```

#### Template với values:
```yaml
# templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Release.Name }}-app
spec:
  replicas: {{ .Values.replicaCount }}
  template:
    spec:
      containers:
        - name: {{ .Chart.Name }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
```

### 8.6 Managed Kubernetes Services

| Cloud | Service | Đặc điểm |
|-------|---------|-----------|
| Azure | **AKS** (Azure Kubernetes Service) | Tích hợp Azure AD, ACR |
| AWS | **EKS** (Elastic Kubernetes Service) | Tích hợp IAM, ECR |
| Google | **GKE** (Google Kubernetes Engine) | Auto-upgrade, auto-repair |

#### Tạo AKS cluster:
```bash
az aks create \
  --resource-group myRG \
  --name myAKSCluster \
  --node-count 3 \
  --node-vm-size Standard_DS2_v2 \
  --enable-addons monitoring \
  --generate-ssh-keys

# Lấy credentials
az aks get-credentials --resource-group myRG --name myAKSCluster

# Verify
kubectl get nodes
```

### 8.7 Monitoring Kubernetes

#### Prometheus + Grafana
- **Prometheus**: Thu thập metrics từ cluster
- **Grafana**: Visualization dashboards

#### kubectl top (metrics cơ bản):
```bash
kubectl top nodes
kubectl top pods
kubectl top pods --all-namespaces
```

#### Tools monitoring:
- **Lens**: Desktop GUI cho Kubernetes
- **Octant**: Web-based K8s dashboard
- **Kubernetes Dashboard**: Built-in web UI

---

## Chương 9: Testing APIs với Postman & Newman

### 9.1 Postman là gì?

Postman là công cụ miễn phí để **test APIs**. Cho phép tạo, quản lý, và tự động hóa API tests.

### 9.2 Các khái niệm chính

| Khái niệm | Mô tả |
|-----------|-------|
| **Collection** | Thư mục chứa các requests (tổ chức tests) |
| **Request** | Cấu hình API call (URL, method, headers, body) |
| **Environment** | Tập biến cho từng môi trường (Local, QA, Prod) |
| **Variable** | Giá trị dynamic dùng `{{variable_name}}` |
| **Tests** | Scripts JavaScript kiểm tra response |

### 9.3 Request Configuration

Thông số chính của một request:
- **URL**: Endpoint API (`https://api.example.com/posts`)
- **Method**: `GET`, `POST`, `PUT`, `DELETE`, `PATCH`
- **Authentication**: Bearer Token, API Key, OAuth
- **Headers**: Content-Type, Authorization
- **Body**: JSON data cho POST/PUT
- **Tests**: Assertions kiểm tra kết quả

### 9.4 Environments & Variables

Dùng biến để chạy cùng request trên nhiều environments:

```
Environment: Local       →  PostID = 6
Environment: QA          →  PostID = 7
Environment: Production  →  PostID = 1

Request URL: https://jsonplaceholder.typicode.com/posts/{{PostID}}
```

### 9.5 Viết Postman Tests

Tests viết bằng JavaScript trong tab **Tests**:

```javascript
// Test status code = 200
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Test response time < 400ms
pm.test("Response time is less than 400ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(400);
});

// Test response is JSON
pm.test("Json response is not empty", function () {
    pm.expect(pm.response).to.be.json;
});

// Test specific field value
pm.test("Json response userId eq 1", function () {
    var jsonRes = pm.response.json();
    pm.expect(jsonRes.userId).to.eq(1);
});

// Test response contains specific key
pm.test("Response has id field", function () {
    var jsonRes = pm.response.json();
    pm.expect(jsonRes).to.have.property('id');
});
```

### 9.6 Collection Runner

- Chạy tất cả requests trong collection **tuần tự**
- Chọn environment, số iterations, delay
- Xem kết quả tất cả tests cùng lúc

### 9.7 Newman - CLI cho Postman

Newman là **command-line tool** để chạy Postman tests tự động (cho CI/CD).

#### Cài đặt:
```bash
npm install -g newman
```

#### Chạy Newman:
```bash
# Chạy collection với environment
newman run DemoBook.postman_collection.json -e Local.postman_environment.json

# Với JUnit report (cho CI/CD)
newman run collection.json -e environment.json \
  -r junit,cli \
  --reporter-junit-export result-tests.xml
```

#### Tích hợp Newman trong package.json:
```json
{
  "name": "postman",
  "scripts": {
    "testapilocal": "newman run DemoBook.postman_collection.json -e Local.postman_environment.json -r junit,cli --reporter-junit-export result-tests-local.xml",
    "testapiQA": "newman run DemoBook.postman_collection.json -e QA.postman_environment.json -r junit,cli --reporter-junit-export result-tests-qa.xml"
  },
  "devDependencies": {
    "newman": "^5.3.0"
  }
}
```

#### Pipeline CI/CD cho Newman (Azure Pipelines):
1. **npm install** → Cài Newman
2. **npm run newman** → Chạy tests
3. **Publish Test Results** → Hiển thị kết quả (JUnit format)

### 9.8 Export từ Postman

Để Newman chạy được, cần export:
1. **Collection** → `DemoBook.postman_collection.json`
2. **Environment** (mỗi env) → `Local.postman_environment.json`, `QA.postman_environment.json`

---

## Chương 10: Static Code Analysis với SonarQube

### 10.1 SonarQube là gì?

SonarQube là công cụ mã nguồn mở cho **static code analysis** — phân tích code mà KHÔNG cần chạy application.

#### Phân tích:
- **Bugs**: Lỗi tiềm ẩn trong code
- **Vulnerabilities**: Lỗ hổng bảo mật
- **Code Smells**: Code kém chất lượng, khó maintain
- **Code Duplication**: Code trùng lặp
- **Code Coverage**: Tỷ lệ code được test

### 10.2 Kiến trúc SonarQube

```
┌─────────────────────────────────────────┐
│            Server Components            │
│  ┌────────────┐  ┌──────────────────┐  │
│  │  Web UI    │  │  Compute Engine  │  │
│  └────────────┘  └──────────────────┘  │
│  ┌────────────┐  ┌──────────────────┐  │
│  │Search Engine│  │    Database      │  │
│  │(Elasticsearch)│ │(PostgreSQL/MySQL)│  │
│  └────────────┘  └──────────────────┘  │
└───────────────────┬─────────────────────┘
                    │
        ┌───────────┼───────────┐
        ▼                       ▼
┌──────────────┐      ┌──────────────┐
│  SonarLint   │      │  Scanners    │
│(IDE Plugin)  │      │(CI/CD agents)│
│ Developer PC │      │   Pipeline   │
└──────────────┘      └──────────────┘
```

#### Server-side:
- **Database**: Lưu kết quả phân tích
- **Web Application**: Dashboard reports
- **Compute Engine**: Xử lý và phân tích data
- **Search Engine**: Elasticsearch cho search

#### Client-side:
- **SonarQube Scanners**: Chạy trên CI/CD agents, quét code
- **SonarLint**: IDE plugin, phân tích real-time trên máy developer

### 10.3 Cài đặt SonarQube

#### Docker (nhanh nhất):
```bash
docker run -d --name sonarqube -p 9000:9000 sonarqube:latest
# Access: http://localhost:9000 (admin/admin)
```

#### Azure Marketplace:
- Tìm "SonarQube packaged by Bitnami"
- Tạo VM → Access qua Public IP

### 10.4 SonarLint (IDE Plugin)

- Plugin cho VS Code, IntelliJ, Eclipse
- Phân tích code **real-time** khi developer viết code
- Highlight issues ngay trên IDE
- Không cần SonarQube server

### 10.5 Tích hợp SonarQube trong CI/CD

#### Azure Pipelines:
1. Cài extension SonarQube từ Marketplace
2. Cấu hình Service Connection
3. Thêm tasks vào pipeline:
   - Prepare Analysis Configuration
   - Run Code Analysis
   - Publish Quality Gate Result

### 10.6 Quality Gates

Quality Gate là tập rules quyết định code có **pass** hay **fail**:
- Coverage > 80%
- No new bugs
- No new vulnerabilities
- Duplicated lines < 3%

---

## Chương 11: Cloud Services - AWS vs Azure

### 11.1 So sánh dịch vụ chính

| Loại dịch vụ | AWS | Azure |
|-------------|-----|-------|
| Compute (VM) | EC2 | Virtual Machines |
| Container Service | ECS, EKS | ACI, AKS |
| Serverless | Lambda | Azure Functions |
| Object Storage | S3 | Blob Storage |
| Database (SQL) | RDS | Azure SQL Database |
| Database (NoSQL) | DynamoDB | Cosmos DB |
| Networking (VPC) | VPC | Virtual Network |
| Load Balancer | ELB/ALB | Azure Load Balancer |
| DNS | Route 53 | Azure DNS |
| CI/CD | CodePipeline | Azure Pipelines |
| IaC | CloudFormation | ARM Templates |
| Monitoring | CloudWatch | Azure Monitor |
| Identity | IAM | Azure AD / RBAC |
| Container Registry | ECR | ACR |
| Kubernetes | EKS | AKS |

### 11.2 Azure Resource Hierarchy

```
Management Group
└── Subscription
    └── Resource Group
        ├── Virtual Machine
        ├── Storage Account
        ├── App Service
        └── Database
```

---

## Chương 12: GitOps & ArgoCD

### 12.1 GitOps là gì?

GitOps là phương pháp sử dụng **Git** làm **single source of truth** cho cả application code VÀ infrastructure/deployment configuration.

#### Nguyên tắc GitOps:
1. **Declarative**: Mô tả desired state trong Git
2. **Versioned & Immutable**: Mọi thay đổi đều qua Git (audit trail)
3. **Pulled Automatically**: Agent tự động pull và apply changes
4. **Continuously Reconciled**: Tự động detect và fix drift

#### So sánh Push vs Pull deployment:

| Push-based (Traditional CI/CD) | Pull-based (GitOps) |
|-------------------------------|---------------------|
| CI pipeline push thay đổi lên cluster | Agent trong cluster pull thay đổi từ Git |
| Pipeline cần credentials cluster | Chỉ agent trong cluster cần access |
| Jenkins, Azure Pipelines | ArgoCD, Flux |

### 12.2 ArgoCD

ArgoCD là **GitOps controller** cho Kubernetes:
- Monitor Git repo cho K8s manifests
- Tự động sync cluster state với Git
- Web UI hiển thị trạng thái
- Rollback bằng cách revert Git commit

```
┌──────┐     ┌──────────┐     ┌─────────────────┐
│ Git  │────►│  ArgoCD  │────►│ Kubernetes      │
│ Repo │     │(monitors)│     │ Cluster         │
└──────┘     └──────────┘     │ (applies state) │
                              └─────────────────┘
```

#### ArgoCD Application CRD:
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: myapp
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/user/k8s-manifests.git
    targetRevision: HEAD
    path: apps/myapp
  destination:
    server: https://kubernetes.default.svc
    namespace: production
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

---

---

# PHẦN 2: CÂU HỎI TRẮC NGHIỆM ÔN TẬP

---

## Chương 1-2: DevOps Culture & Terraform

**1. Ba trụ cột (axes) của văn hóa DevOps là gì?**
- A. Code, Build, Deploy
- B. Collaboration, Processes, Tools ✓
- C. Plan, Develop, Test
- D. Speed, Quality, Security

**2. Infrastructure as Code có hai cách tiếp cận chính là:**
- A. Manual và Automatic
- B. Imperative và Declarative ✓
- C. Sequential và Parallel
- D. Static và Dynamic

**3. Terraform sử dụng ngôn ngữ nào?**
- A. YAML
- B. JSON
- C. HCL (HashiCorp Configuration Language) ✓
- D. XML

**4. Lệnh nào xem trước thay đổi trước khi áp dụng trong Terraform?**
- A. `terraform init`
- B. `terraform apply`
- C. `terraform plan` ✓
- D. `terraform validate`

**5. Terraform state file dùng để làm gì?**
- A. Lưu code Terraform
- B. Theo dõi trạng thái hiện tại của infrastructure ✓
- C. Lưu credentials
- D. Cấu hình provider

**6. Lệnh `terraform init` thực hiện điều gì?**
- A. Tạo infrastructure
- B. Download provider plugins và khởi tạo backend ✓
- C. Xóa resources
- D. Format code

**7. Remote backend trong Terraform giải quyết vấn đề gì?**
- A. Tăng tốc độ deploy
- B. Cho phép team chia sẻ state file một cách an toàn ✓
- C. Mã hóa code
- D. Tự động format

**8. Đặc điểm của phương pháp Declarative IaC:**
- A. Mô tả step-by-step cách thực hiện
- B. Mô tả kết quả mong muốn (desired state) ✓
- C. Chỉ hỗ trợ 1 cloud provider
- D. Không cần state management

---

## Chương 3: Git

**9. Git là loại Version Control System nào?**
- A. Centralized VCS
- B. Distributed VCS ✓
- C. Local VCS
- D. Cloud VCS

**10. Trong Gitflow, branch `develop` được tạo từ:**
- A. feature branch
- B. release branch
- C. master/main branch ✓
- D. hotfix branch

**11. Branch `hotfix` trong Gitflow được tạo từ đâu và merge vào đâu?**
- A. Tạo từ develop, merge vào master
- B. Tạo từ master, merge vào master + develop ✓
- C. Tạo từ release, merge vào develop
- D. Tạo từ feature, merge vào master

**12. Lệnh nào tạo và chuyển sang branch mới cùng lúc?**
- A. `git branch new && git checkout new`
- B. `git checkout -b new` ✓
- C. `git switch new`
- D. `git create new`

**13. `git stash` dùng để:**
- A. Xóa file
- B. Lưu tạm thay đổi chưa commit ✓
- C. Tạo branch mới
- D. Push lên remote

**14. Pull Request/Merge Request là cơ chế:**
- A. Tự động deploy code
- B. Code review trước khi merge vào branch chính ✓
- C. Backup code
- D. Tạo release notes

**15. Lệnh nào hoàn tác commit nhưng GIỮ lại changes?**
- A. `git reset --hard HEAD~1`
- B. `git reset --soft HEAD~1` ✓
- C. `git revert HEAD`
- D. `git checkout -- .`

---

## Chương 4: Ansible

**16. Đặc điểm QUAN TRỌNG NHẤT của Ansible so với các CM tools khác:**
- A. Viết bằng Python
- B. Agentless (không cần cài agent trên target) ✓
- C. Dùng YAML
- D. Miễn phí

**17. Ansible kết nối đến managed nodes bằng gì?**
- A. HTTP/HTTPS
- B. SSH (Linux) / WinRM (Windows) ✓
- C. Agent installed
- D. gRPC

**18. File inventory trong Ansible chứa:**
- A. Playbook tasks
- B. Danh sách hosts/groups cần quản lý ✓
- C. Variables encrypted
- D. Module definitions

**19. Ansible Vault dùng để:**
- A. Lưu trữ playbooks
- B. Mã hóa dữ liệu nhạy cảm (passwords, keys) ✓
- C. Backup inventory
- D. Quản lý roles

**20. Khái niệm "Idempotent" trong Ansible có nghĩa:**
- A. Chạy song song trên nhiều hosts
- B. Chạy nhiều lần cho kết quả giống nhau ✓
- C. Tự động retry khi fail
- D. Không cần sudo

**21. Handler trong Ansible playbook chỉ chạy khi:**
- A. Luôn chạy sau mỗi task
- B. Được trigger bởi `notify` từ task có thay đổi ✓
- C. Có lỗi xảy ra
- D. Playbook kết thúc

**22. Dynamic Inventory trong Ansible có tác dụng:**
- A. Tạo VM mới
- B. Tự động lấy danh sách hosts từ cloud provider ✓
- C. Encrypt inventory file
- D. Sort hosts theo tên

---

## Chương 5: Packer

**23. Packer được dùng để:**
- A. Quản lý containers
- B. Tạo machine images (VM images) tự động ✓
- C. Deploy applications
- D. Monitor infrastructure

**24. Ba thành phần chính của Packer template là:**
- A. Source, Build, Deploy
- B. Builders, Provisioners, Variables ✓
- C. Input, Process, Output
- D. Image, Container, Registry

**25. Packer hỗ trợ provisioner nào để cài phần mềm?**
- A. Shell, File, Ansible ✓
- B. Chỉ Shell
- C. Chỉ Ansible
- D. Docker only

**26. Kết hợp Packer + Terraform hoạt động như thế nào?**
- A. Terraform tạo image, Packer deploy
- B. Packer tạo image, Terraform dùng image đó để tạo VM ✓
- C. Chúng không thể kết hợp
- D. Cả hai tạo image cùng lúc

---

## Chương 6: CI/CD

**27. Sự khác biệt giữa Continuous Delivery và Continuous Deployment:**
- A. Không khác biệt
- B. Delivery cần manual approval; Deployment hoàn toàn tự động ✓
- C. Delivery chỉ build; Deployment có test
- D. Delivery cho staging; Deployment cho dev

**28. Azure DevOps gồm bao nhiêu dịch vụ chính?**
- A. 3
- B. 4
- C. 5 (Boards, Repos, Pipelines, Test Plans, Artifacts) ✓
- D. 6

**29. Trong GitLab CI, file cấu hình pipeline có tên:**
- A. Jenkinsfile
- B. azure-pipelines.yml
- C. .gitlab-ci.yml ✓
- D. .github/workflows/ci.yml

**30. Trong Jenkins, Pipeline as Code được viết trong file:**
- A. pipeline.yml
- B. Jenkinsfile ✓
- C. build.gradle
- D. .jenkins/config.xml

**31. GitHub Actions sử dụng khái niệm nào để tái sử dụng logic?**
- A. Plugins
- B. Extensions
- C. Actions (Marketplace) ✓
- D. Modules

**32. Trong GitLab CI, `artifacts` là:**
- A. Docker images
- B. Output files từ job dùng cho job sau ✓
- C. Git branches
- D. Test reports

**33. Stage nào PHẢI chạy trước stage khác (dependency)?**
- A. Tất cả stages chạy song song
- B. Stages chạy tuần tự theo thứ tự khai báo ✓
- C. Chỉ deploy stage chạy cuối
- D. Không có thứ tự

---

## Chương 7: Docker

**34. Docker container khác VM ở điểm nào QUAN TRỌNG NHẤT?**
- A. Container chia sẻ kernel host OS, VM có OS riêng ✓
- B. Container lớn hơn VM
- C. Container chậm hơn VM
- D. Container cần hypervisor

**35. Instruction nào PHẢI là dòng đầu tiên trong Dockerfile?**
- A. RUN
- B. CMD
- C. FROM ✓
- D. COPY

**36. Sự khác biệt giữa CMD và ENTRYPOINT:**
- A. Không khác nhau
- B. CMD có thể override khi `docker run`; ENTRYPOINT thì không (trừ --entrypoint) ✓
- C. CMD chạy khi build; ENTRYPOINT chạy khi run
- D. CMD cho Linux; ENTRYPOINT cho Windows

**37. Multi-stage build trong Dockerfile dùng để:**
- A. Chạy nhiều containers
- B. Giảm kích thước image cuối cùng ✓
- C. Build cho nhiều OS
- D. Tăng tốc build

**38. Docker Compose dùng để:**
- A. Build Docker images
- B. Định nghĩa và chạy multi-container applications ✓
- C. Push images lên registry
- D. Monitor containers

**39. Lệnh nào chạy container ở background (detached mode)?**
- A. `docker run -it myapp`
- B. `docker run -d myapp` ✓
- C. `docker run -bg myapp`
- D. `docker run --background myapp`

**40. `.dockerignore` dùng để:**
- A. Ignore Docker errors
- B. Exclude files khỏi build context (giảm image size) ✓
- C. Ignore containers
- D. Stop containers

**41. Lệnh `docker exec -it container_name bash` dùng để:**
- A. Tạo container mới
- B. Mở terminal interactive bên trong container đang chạy ✓
- C. Build image
- D. Push image

**42. `EXPOSE 80` trong Dockerfile:**
- A. Tự động mở port 80
- B. Chỉ là documentation, KHÔNG thực sự mở port ✓
- C. Block port 80
- D. Map port 80:80

---

## Chương 8: Kubernetes

**43. Pod trong Kubernetes là:**
- A. Một cluster
- B. Đơn vị triển khai nhỏ nhất, chứa 1+ containers ✓
- C. Một node
- D. Một service

**44. Component nào trên Master Node lưu trữ cluster state?**
- A. API Server
- B. Scheduler
- C. etcd ✓
- D. Controller Manager

**45. Service type nào expose application ra external IP qua cloud load balancer?**
- A. ClusterIP
- B. NodePort
- C. LoadBalancer ✓
- D. ExternalName

**46. Lệnh nào scale deployment lên 5 replicas?**
- A. `kubectl replicas webapp 5`
- B. `kubectl scale deployment webapp --replicas=5` ✓
- C. `kubectl resize webapp 5`
- D. `kubectl update webapp --scale=5`

**47. Helm trong Kubernetes là:**
- A. Monitoring tool
- B. Package manager (quản lý Charts) ✓
- C. Container runtime
- D. Network plugin

**48. `kubelet` chạy trên:**
- A. Chỉ Master Node
- B. Mỗi Worker Node ✓
- C. Chỉ Pod
- D. External server

**49. Rolling Update strategy trong Deployment cho phép:**
- A. Update tất cả pods cùng lúc
- B. Update từng pod một, đảm bảo zero-downtime ✓
- C. Xóa tất cả rồi tạo mới
- D. Chỉ update 1 pod

**50. ConfigMap trong Kubernetes dùng để:**
- A. Lưu Docker images
- B. Lưu configuration data dạng key-value (không sensitive) ✓
- C. Mã hóa passwords
- D. Define network policies

**51. Lệnh rollback deployment về version trước:**
- A. `kubectl rollback deployment/webapp`
- B. `kubectl rollout undo deployment/webapp` ✓
- C. `kubectl revert deployment/webapp`
- D. `kubectl reset deployment/webapp`

**52. AKS (Azure Kubernetes Service) là:**
- A. Tự quản lý hoàn toàn cluster
- B. Managed Kubernetes service - Azure quản lý Master Node ✓
- C. Chỉ chạy trên Windows
- D. Container registry

---

## Chương 9-10: Testing & SonarQube

**53. Newman là:**
- A. GUI tool cho API testing
- B. Command-line tool để chạy Postman tests tự động ✓
- C. Web browser
- D. Database tool

**54. Postman tests viết bằng ngôn ngữ nào?**
- A. Python
- B. Java
- C. JavaScript ✓
- D. YAML

**55. Trong Postman, biến được sử dụng với cú pháp:**
- A. `${variable}`
- B. `{{variable}}` ✓
- C. `$variable`
- D. `%variable%`

**56. SonarQube phân tích những gì?**
- A. Chỉ bugs
- B. Bugs, Vulnerabilities, Code Smells, Duplication, Coverage ✓
- C. Chỉ security
- D. Chỉ performance

**57. SonarLint khác SonarQube Scanner ở điểm:**
- A. SonarLint chạy real-time trên IDE developer; Scanner chạy trên CI/CD ✓
- B. Không khác nhau
- C. SonarLint chạy trên server
- D. Scanner chạy trên IDE

**58. Quality Gate trong SonarQube là:**
- A. Firewall rules
- B. Tập conditions quyết định code pass/fail quality checks ✓
- C. Git branch protection
- D. Deployment gate

---

## Chương 11-12: GitOps & ArgoCD

**59. Nguyên tắc cốt lõi của GitOps:**
- A. Git là single source of truth cho infrastructure state ✓
- B. Dùng GitHub để host code
- C. Mỗi commit tạo 1 release
- D. Chỉ dùng Git CLI

**60. ArgoCD hoạt động theo mô hình:**
- A. Push-based (pipeline push changes)
- B. Pull-based (agent pull changes từ Git) ✓
- C. Manual deployment
- D. Event-driven

**61. Lợi ích chính của GitOps so với CI/CD truyền thống:**
- A. Nhanh hơn
- B. Dễ audit, rollback bằng git revert, không cần cluster credentials trong CI ✓
- C. Rẻ hơn
- D. Ít tools hơn

---

## Câu hỏi tổng hợp

**62. Tool nào KHÔNG phải là IaC tool?**
- A. Terraform
- B. Ansible
- C. Prometheus ✓
- D. CloudFormation

**63. DevOps lifecycle đúng thứ tự:**
- A. Code → Plan → Build → Deploy → Test
- B. Plan → Code → Build → Test → Release → Deploy → Operate → Monitor ✓
- C. Plan → Deploy → Test → Code → Build
- D. Code → Build → Deploy → Monitor

**64. Công cụ nào dùng cho container orchestration?**
- A. Docker Compose
- B. Kubernetes ✓
- C. Terraform
- D. Ansible

**65. Trong DevOps, "Shift Left" nghĩa là:**
- A. Move deployment sang trái
- B. Thực hiện testing/security sớm hơn trong development lifecycle ✓
- C. Viết code từ trái sang phải
- D. Deploy trước khi test

---

---

# PHẦN 3: CÂU HỎI TỰ LUẬN ÔN TẬP

---

## Câu hỏi cơ bản

**1. Trình bày 3 trụ cột của văn hóa DevOps. Cho ví dụ cụ thể cho mỗi trụ cột.**

**Gợi ý trả lời:**
- Collaboration: Dev + Ops cùng tham gia sprint planning, shared on-call rotation
- Processes: CI/CD pipeline tự động (commit → build → test → deploy), IaC cho infrastructure
- Tools: Git cho version control, Jenkins/Azure DevOps cho CI/CD, Docker cho containerization, Terraform cho IaC

---

**2. So sánh Imperative và Declarative IaC. Cho ví dụ công cụ và code cho mỗi loại.**

**Gợi ý trả lời:**
- Imperative: Mô tả CÁCH làm (step-by-step). Ví dụ: Bash script `az vm create...`
- Declarative: Mô tả KẾT QUẢ mong muốn. Ví dụ: Terraform `resource "azurerm_virtual_machine" {...}`
- Declarative dễ maintain hơn, idempotent, có state management
- Imperative linh hoạt hơn cho logic phức tạp

---

**3. Giải thích workflow của Terraform: init → plan → apply → destroy. Mỗi bước làm gì?**

**Gợi ý trả lời:**
- `init`: Download provider plugins (azurerm, aws...), khởi tạo backend (local/remote)
- `plan`: Đọc state file, so sánh với config, hiển thị changes sẽ thực hiện (+ create, ~ update, - delete)
- `apply`: Thực thi changes đã plan, cập nhật state file
- `destroy`: Xóa TẤT CẢ resources được quản lý bởi Terraform

---

**4. Mô tả Gitflow workflow. Vẽ sơ đồ và giải thích vai trò từng branch.**

**Gợi ý trả lời:**
- master: Production code, always stable, tagged với version
- develop: Integration branch, nơi merge tất cả features
- feature/*: Phát triển tính năng mới, tạo từ develop, merge vào develop
- release/*: Chuẩn bị release (fix bugs, update docs), tạo từ develop, merge vào master + develop
- hotfix/*: Fix bug khẩn cấp trên production, tạo từ master, merge vào master + develop

---

**5. Ansible là agentless - giải thích ý nghĩa và lợi ích.**

**Gợi ý trả lời:**
- Agentless: KHÔNG cần cài phần mềm (agent) trên các máy được quản lý
- Kết nối qua SSH (Linux) hoặc WinRM (Windows) - protocol có sẵn
- Lợi ích: Dễ setup (chỉ cần SSH access), ít overhead, không cần maintain agent, bảo mật hơn (ít attack surface)
- So sánh: Chef/Puppet CẦN agent → phức tạp hơn

---

## Câu hỏi nâng cao

**6. Viết một Dockerfile hoàn chỉnh cho ứng dụng Node.js với multi-stage build. Giải thích tại sao dùng multi-stage.**

**Gợi ý trả lời:**
```dockerfile
# Stage 1: Build
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production (chỉ copy output)
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/index.js"]
```
Multi-stage giúp: image cuối nhỏ hơn (chỉ chứa production files), không chứa dev dependencies và source code, tăng bảo mật.

---

**7. So sánh Docker Container và Virtual Machine. Khi nào nên dùng VM, khi nào nên dùng Container?**

**Gợi ý trả lời:**
- Container: Nhẹ (MB), khởi động nhanh (giây), chia sẻ kernel, process-level isolation
- VM: Nặng (GB), khởi động chậm (phút), OS riêng, full isolation
- Dùng Container: Microservices, CI/CD, dev environments, stateless apps
- Dùng VM: Cần OS khác (Windows trên Linux host), compliance requirements, legacy apps, complete isolation

---

**8. Thiết kế CI/CD pipeline cho một web application. Mô tả các stages và tools sử dụng.**

**Gợi ý trả lời:**
1. **Source**: Git push trigger (GitHub/GitLab)
2. **Build**: Compile code, bundle assets (webpack, maven)
3. **Unit Test**: Run unit tests (Jest, JUnit)
4. **Static Analysis**: SonarQube scan
5. **Docker Build**: Build và push image lên ACR/ECR
6. **Integration Test**: Deploy lên test env, run API tests (Newman)
7. **Deploy Staging**: Terraform/kubectl apply lên staging
8. **Acceptance Test**: E2E tests (Cypress, Selenium)
9. **Deploy Production**: Manual approval → deploy lên prod
10. **Monitor**: Prometheus/Grafana alerts

---

**9. Giải thích kiến trúc Kubernetes. Vai trò của từng component trên Master Node và Worker Node.**

**Gợi ý trả lời:**

**Master Node (Control Plane):**
- API Server: Gateway cho mọi request (kubectl, UI, APIs)
- Scheduler: Quyết định pod chạy trên node nào (dựa trên resources, constraints)
- Controller Manager: Đảm bảo desired state (replica count, node health)
- etcd: Distributed key-value store, lưu toàn bộ cluster state

**Worker Node:**
- kubelet: Agent quản lý pods trên node, report status về Master
- kube-proxy: Quản lý network rules, load balancing giữa pods
- Container Runtime: Docker/containerd thực thi containers

---

**10. GitOps với ArgoCD hoạt động như thế nào? So sánh với CI/CD pipeline truyền thống.**

**Gợi ý trả lời:**

**Truyền thống (Push-based):**
- CI pipeline build → test → push image → kubectl apply (push vào cluster)
- Pipeline cần cluster credentials
- Khó audit ai deploy gì khi nào

**GitOps (Pull-based):**
- CI pipeline build → test → push image → update Git manifest (image tag)
- ArgoCD trong cluster detect Git change → pull & apply
- Git = single source of truth, mọi change đều là Git commit
- Rollback = git revert
- Audit trail = git log
- Cluster credentials không rời khỏi cluster

---

**11. Viết Kubernetes Deployment + Service YAML cho ứng dụng web với 3 replicas, expose qua LoadBalancer port 80.**

**Gợi ý trả lời:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: webapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: webapp
  template:
    metadata:
      labels:
        app: webapp
    spec:
      containers:
        - name: webapp
          image: myregistry/webapp:1.0
          ports:
            - containerPort: 80
          resources:
            requests:
              cpu: "100m"
              memory: "128Mi"
            limits:
              cpu: "500m"
              memory: "256Mi"
---
apiVersion: v1
kind: Service
metadata:
  name: webapp-service
spec:
  type: LoadBalancer
  selector:
    app: webapp
  ports:
    - port: 80
      targetPort: 80
```

---

**12. Thiết kế hệ thống monitoring cho ứng dụng chạy trên Kubernetes. Sử dụng những tools nào và monitor những metrics gì?**

**Gợi ý trả lời:**

**Tools:**
- Prometheus: Thu thập metrics (CPU, memory, request count, latency)
- Grafana: Dashboards visualization
- AlertManager: Gửi alerts (Slack, email, PagerDuty)
- Loki: Log aggregation
- kubectl top: Quick resource check

**Metrics cần monitor:**
- **Infrastructure**: Node CPU/Memory/Disk, Pod resource usage
- **Application**: Response time, error rate, request throughput
- **Business**: Active users, transactions/sec, conversion rate
- **Kubernetes**: Pod restarts, deployment status, HPA events

**Alerts:**
- Pod CrashLoopBackOff > 3 times
- CPU > 80% sustained
- Response time > 2s
- Error rate > 5%

---

**13. Packer, Ansible, Terraform - giải thích vai trò từng tool và cách chúng kết hợp với nhau trong workflow DevOps.**

**Gợi ý trả lời:**

**Vai trò:**
- **Packer**: Tạo machine images (golden image với phần mềm đã cài)
- **Ansible**: Configuration management (cấu hình servers, cài phần mềm)
- **Terraform**: Infrastructure provisioning (tạo VMs, networks, databases)

**Workflow kết hợp:**
1. **Ansible** viết playbook cài đặt phần mềm (nginx, app dependencies)
2. **Packer** dùng Ansible provisioner để tạo VM image
3. **Terraform** dùng Packer image để tạo VM instances

```
Ansible Playbook → Packer (build image) → Terraform (deploy VMs from image)
```

Lợi ích: VMs khởi động nhanh (đã cài sẵn mọi thứ), consistent environment, version control cho toàn bộ stack.

---

**14. So sánh Jenkins, Azure Pipelines, GitLab CI, và GitHub Actions. Khi nào nên chọn tool nào?**

**Gợi ý trả lời:**

| | Jenkins | Azure Pipelines | GitLab CI | GitHub Actions |
|-|---------|----------------|-----------|----------------|
| **Khi nào** | Complex enterprise, cần full control | Azure ecosystem, Microsoft stack | GitLab all-in-one | GitHub projects, open source |
| **Ưu điểm** | Plugins nhiều, linh hoạt nhất | Tích hợp Azure, free tier tốt | Tích hợp chặt GitLab, CI/CD + Git 1 nơi | Dễ dùng, marketplace lớn |
| **Nhược điểm** | Phức tạp setup/maintain | Lock-in Azure | Lock-in GitLab | Lock-in GitHub |
| **Self-hosted** | Bắt buộc | Tùy chọn | Tùy chọn | Tùy chọn (runners) |

---

**15. Viết Postman tests cho API endpoint GET /users/:id. Test status code, response time, và cấu trúc JSON response.**

**Gợi ý trả lời:**
```javascript
// Test 1: Status code
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Test 2: Response time
pm.test("Response time is acceptable", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});

// Test 3: Response is JSON
pm.test("Response is JSON", function () {
    pm.expect(pm.response).to.be.json;
});

// Test 4: Response structure
pm.test("Response has required fields", function () {
    var json = pm.response.json();
    pm.expect(json).to.have.property('id');
    pm.expect(json).to.have.property('name');
    pm.expect(json).to.have.property('email');
    pm.expect(json.id).to.eql(parseInt(pm.variables.get("userId")));
});

// Test 5: Data types
pm.test("Fields have correct types", function () {
    var json = pm.response.json();
    pm.expect(json.id).to.be.a('number');
    pm.expect(json.name).to.be.a('string');
    pm.expect(json.email).to.include('@');
});
```

---

## Mẹo ôn thi

1. **Hiểu KHÁI NIỆM** hơn là thuộc lòng syntax
2. **So sánh** các tools cùng loại (Terraform vs Ansible, Docker vs VM)
3. **Workflow** quan trọng: biết thứ tự và mục đích từng bước
4. **Hands-on**: Thử viết Dockerfile, K8s YAML, Terraform config
5. **Kết nối**: Hiểu cách các tools phối hợp trong pipeline end-to-end

