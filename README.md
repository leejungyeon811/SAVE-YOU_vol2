# 🌟SAVE, YOU: 개인정보 노출 방지 웹사이트🌟

## 📜목차
1. [프로젝트 개요](#프로젝트-개요)
2. [아이디어 발굴 과정](#아이디어-발굴-과정)
   - [배경 및 동기](#배경-및-동기)
   - [아이디어 설명](#아이디어-설명)
   - [아이디어의 차별성](#아이디어의-차별성)
3. [인공지능 기반 솔루션](#인공지능-기반-솔루션)
   - [사진 기술](#사진-기술)
   - [텍스트 기술](#텍스트-기술)
4. [구현 및 분석 결과](#구현-및-분석-결과)
   - [개발 환경](#개발-환경)
   - [웹페이지 설명](#웹페이지-설명)
5. [활용성 및 기대효과](#활용성-및-기대효과)
6. [출처](#출처)
7. [폴더 구조](#폴더-구조)

---

## 💫프로젝트 개요
SAVE, YOU는 SNS에서 게시된 사진 및 텍스트 속 민감한 정보를 보호하는 웹 애플리케이션입니다.  
이미지는 **SegFormer** 모델을 활용해 배경의 건물을 탐지하고 이를 처리하며, 텍스트는 **KLUE-BERT** 모델을 통해 민감 정보를 자동으로 탐지하고 마스킹합니다.  
이 프로젝트는 이미지와 텍스트를 통합적으로 처리하여 개인정보 보호를 강화합니다.

---

## 💡아이디어 발굴 과정

### 배경 및 동기
SNS에 게시된 사진과 글 속에서 무심코 노출된 개인정보는 범죄로 악용될 가능성이 있습니다.   
이 프로젝트는 다음과 같은 목표를 가지고 있습니다:
1. 배경에 드러난 민감 정보를 탐지 및 제거.
2. 텍스트에서 민감 정보를 자동으로 탐지 및 마스킹.

### 아이디어 설명
1. **사진 기술**: 배경의 건물 등 민감 정보를 SegFormer 모델로 탐지하고 이를 제거 또는 대체.
2. **텍스트 기술**: 텍스트에서 이름, 주소 등 민감 정보를 탐지 후 마스킹.

### 아이디어의 차별성
- 기존 AI 필터 서비스는 사용자가 수동으로 민감 정보를 설정해야 하지만, SAVE, YOU는 자동으로 탐지 및 수정.
- 이미지와 텍스트를 동시에 처리하는 포괄적인 개인정보 보호 기능 제공.

---

## 🤖인공지능 기반 솔루션

### 사진 기술
1. **SegFormer 모델 활용**:
   - **Cityscapes 데이터셋**으로 훈련된 SegFormer를 활용해 건물을 세그멘테이션.
   - [nvidia/segformer-b5-finetuned-cityscapes-1024-1024](https://huggingface.co/nvidia/segformer-b5-finetuned-cityscapes-1024-1024) 사용.

2. **DeepFillv2**:
   - 건물 영역을 GAN 기반 모델 DeepFillv2로 자연스럽게 대체.
   - [deepfillv2-pytorch](https://github.com/nipponjo/deepfillv2-pytorch) 사용.

### 텍스트 기술
- **KLUE-BERT 모델**:
   - KLUE-NER 데이터셋으로 훈련하여 민감 정보를 탐지.
   - [KLUE-BERT](https://huggingface.co/klue/bert-base) 사용.
- 민감 정보 탐지 후 [MASK]로 처리.

---

## 👩‍💻구현 및 분석 결과

### 개발 환경
1. **프로그래밍 언어**:
   - Python (AI 모델 및 서버)
   - JavaScript (프론트엔드)
2. **프레임워크 및 라이브러리**:
   - Flask (백엔드 API)
   - React (프론트엔드)
   - Hugging Face Transformers
3. **도구**:
   - GitHub (코드 관리)
   - Visual Studio Code (IDE)

### 웹페이지 설명
1. **Home**
   - 프로젝트 소개 및 주요 기능 제공.

2. **Picture**
   - 사용자는 사진을 업로드하고, Blur, Noise, GenerateAI 옵션으로 처리 가능.
   - 결과 이미지를 확인하고 저장 가능.

3. **Text**
   - 텍스트 입력 후 민감 정보가 자동으로 마스킹.
   - 마스킹된 결과를 편집하거나 복사 가능.

---

## 😆활용성 및 기대효과
- **범죄 예방**: 개인정보 유출로 인한 스토킹, 도난 등 범죄를 사전에 차단.
- **사용자 편의성**: SNS 사용의 자연스러움을 해치지 않으면서 개인정보를 보호.
- **개인정보 보호의 대중화**: 기술적 지식이 없는 사용자도 손쉽게 개인정보를 보호 가능.

---

## 👌출처
1. [SegFormer 모델](https://huggingface.co/nvidia/segformer-b5-finetuned-cityscapes-1024-1024)
2. [DeepFillv2 모델](https://github.com/nipponjo/deepfillv2-pytorch)

---

## 📂폴더 구조
```plaintext
├── api                      # Flask 서버 (deepfillv2-pytorch 포함)
│   ├── server.py
│   ├── server_ner.py
│   ├── KLUE-BERT_model_train_code_by_KLUE-NER.ipynb # 모델 훈련 코드
│   └── requirements.txt      # Python 3.11 이상의 가상환경 필요
├── client
│   ├── public
│   ├── src
│   └── package.json
├── README.md
└── .gitignore
