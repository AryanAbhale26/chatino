import subprocess
import sys
import os

COMMITS = [
    # 1. Project Initialization & Documentation
    {
        "files": [".gitignore", "Readme.md", "CONTRIBUTING.md"],
        "message": "chore: initialize project repository structure and documentation"
    },
    # 2. Backend Maven Configuration
    {
        "files": [
            "backend/pom.xml",
            "backend/mvnw",
            "backend/mvnw.cmd",
            "backend/.mvn",
            "backend/.gitignore",
            "backend/.env.example"
        ],
        "message": "build(backend): configure maven build setup and environment templates"
    },
    # 3. Backend Core Domain Models
    {
        "files": [
            "backend/src/main/java/com/chattingo/Model/User.java",
            "backend/src/main/java/com/chattingo/Model/Chat.java",
            "backend/src/main/java/com/chattingo/Model/Message.java"
        ],
        "message": "feat(backend): add core jpa entities for user, chat and message models"
    },
    # 4. Backend Request/Response Payloads & DTOs
    {
        "files": [
            "backend/src/main/java/com/chattingo/Payload/ApiResponse.java",
            "backend/src/main/java/com/chattingo/Payload/AuthResponse.java",
            "backend/src/main/java/com/chattingo/Payload/LoginRequest.java",
            "backend/src/main/java/com/chattingo/Payload/SingleChatRequest.java",
            "backend/src/main/java/com/chattingo/Payload/GroupChatRequest.java",
            "backend/src/main/java/com/chattingo/Payload/SendMessageRequest.java",
            "backend/src/main/java/com/chattingo/Payload/UpdateUserRequest.java",
            "backend/src/main/java/com/chattingo/Payload/ErrorDetail.java"
        ],
        "message": "feat(backend): define request and response payload dtos"
    },
    # 5. Backend Spring Data JPA Repositories
    {
        "files": [
            "backend/src/main/java/com/chattingo/Repository/UserRepository.java",
            "backend/src/main/java/com/chattingo/Repository/ChatRepository.java",
            "backend/src/main/java/com/chattingo/Repository/MessageRepository.java"
        ],
        "message": "feat(backend): implement spring data jpa repositories"
    },
    # 6. Backend Exceptions and Global Handler
    {
        "files": [
            "backend/src/main/java/com/chattingo/Exception/UserException.java",
            "backend/src/main/java/com/chattingo/Exception/ChatException.java",
            "backend/src/main/java/com/chattingo/Exception/MessageException.java",
            "backend/src/main/java/com/chattingo/Exception/GlobalExceptionHandler.java"
        ],
        "message": "feat(backend): add custom exceptions and global rest exception handler"
    },
    # 7. Backend Service Interfaces
    {
        "files": [
            "backend/src/main/java/com/chattingo/Service/UserService.java",
            "backend/src/main/java/com/chattingo/Service/ChatService.java",
            "backend/src/main/java/com/chattingo/Service/MessageService.java"
        ],
        "message": "feat(backend): declare business service interfaces"
    },
    # 8. Backend Service Implementations
    {
        "files": [
            "backend/src/main/java/com/chattingo/ServiceImpl/UserServiceImpl.java",
            "backend/src/main/java/com/chattingo/ServiceImpl/ChatServiceImpl.java",
            "backend/src/main/java/com/chattingo/ServiceImpl/MessageServiceImpl.java"
        ],
        "message": "feat(backend): implement user, chat, and message service logic"
    },
    # 9. Backend Security & JWT Infrastructure
    {
        "files": [
            "backend/src/main/java/com/chattingo/config/JwtConstant.java",
            "backend/src/main/java/com/chattingo/config/TokenProvider.java",
            "backend/src/main/java/com/chattingo/config/JwtValidator.java",
            "backend/src/main/java/com/chattingo/config/CustomUserService.java",
            "backend/src/main/java/com/chattingo/config/AppConfig.java"
        ],
        "message": "feat(backend): configure spring security and jwt token authentication"
    },
    # 10. Backend WebSocket Messaging Configuration
    {
        "files": [
            "backend/src/main/java/com/chattingo/config/WebSocketConfig.java"
        ],
        "message": "feat(backend): enable websocket message broker for real-time stomp communications"
    },
    # 11. Backend REST & WebSocket Controllers
    {
        "files": [
            "backend/src/main/java/com/chattingo/Controller/HomeController.java",
            "backend/src/main/java/com/chattingo/Controller/AuthController.java",
            "backend/src/main/java/com/chattingo/Controller/UserController.java",
            "backend/src/main/java/com/chattingo/Controller/ChatController.java",
            "backend/src/main/java/com/chattingo/Controller/MessageController.java",
            "backend/src/main/java/com/chattingo/Controller/RealTimeChat.java"
        ],
        "message": "feat(backend): expose rest endpoints for auth, users, chats, and messages"
    },
    # 12. Backend Main Entrypoint & Application Properties
    {
        "files": [
            "backend/src/main/java/com/chattingo/ChattingoApplication.java",
            "backend/src/main/resources/application.properties",
            "backend/src/test"
        ],
        "message": "feat(backend): configure datasource connection and application bootstrap"
    },
    # 13. Frontend Base Configuration & Assets
    {
        "files": [
            "frontend/package.json",
            "frontend/package-lock.json",
            "frontend/.gitignore",
            "frontend/.env.example",
            "frontend/tailwind.config.js",
            "frontend/public",
            "frontend/src/config/api.js"
        ],
        "message": "build(frontend): setup react 18 project with tailwindcss and api config"
    },
    # 14. Frontend Root Component & Entry Point
    {
        "files": [
            "frontend/src/index.css",
            "frontend/src/index.js",
            "frontend/src/App.css",
            "frontend/src/App.js",
            "frontend/src/App.test.js",
            "frontend/src/reportWebVitals.js",
            "frontend/src/setupTests.js",
            "frontend/src/logo.svg"
        ],
        "message": "feat(frontend): initialize root app structure and global stylesheets"
    },
    # 15. Frontend Redux Auth State Management
    {
        "files": [
            "frontend/src/Redux/Auth/ActionType.js",
            "frontend/src/Redux/Auth/Action.js",
            "frontend/src/Redux/Auth/Reducer.js"
        ],
        "message": "feat(frontend): implement redux auth actions, action types, and reducer"
    },
    # 16. Frontend Redux Chat State Management
    {
        "files": [
            "frontend/src/Redux/Chat/ActionType.js",
            "frontend/src/Redux/Chat/Action.js",
            "frontend/src/Redux/Chat/Reducer.js"
        ],
        "message": "feat(frontend): implement redux chat slice for managing active conversation states"
    },
    # 17. Frontend Redux Message State Management & Store Setup
    {
        "files": [
            "frontend/src/Redux/Message/ActionType.js",
            "frontend/src/Redux/Message/Action.js",
            "frontend/src/Redux/Message/Reducer.js",
            "frontend/src/Redux/store.jsx"
        ],
        "message": "feat(frontend): create redux message state management and root store"
    },
    # 18. Frontend Authentication Pages (Signin & Signup)
    {
        "files": [
            "frontend/src/Components/Register/Signin.jsx",
            "frontend/src/Components/Register/Signup.jsx"
        ],
        "message": "feat(frontend): design sign-in and sign-up registration components"
    },
    # 19. Frontend User Profile & Navigation Components
    {
        "files": [
            "frontend/src/Components/Profile/Profile.jsx",
            "frontend/src/Components/HomeComponents/ProfileSection.jsx",
            "frontend/src/Components/HomeComponents/SearchBar.jsx"
        ],
        "message": "feat(frontend): build user profile view, header section, and search bar"
    },
    # 20. Frontend Chat and Group Management UI
    {
        "files": [
            "frontend/src/Components/ChatCard/ChatCard.jsx",
            "frontend/src/Components/HomeComponents/ChatList.jsx",
            "frontend/src/Components/Group/CreateGroup.jsx",
            "frontend/src/Components/Group/NewGroup.jsx",
            "frontend/src/Components/Group/SelectedMember.jsx"
        ],
        "message": "feat(frontend): create chat cards, conversation list, and group creation modals"
    },
    # 21. Frontend Story / Status Module
    {
        "files": [
            "frontend/src/Components/Status/DummyStorage.jsx",
            "frontend/src/Components/Status/ProgressBar.css",
            "frontend/src/Components/Status/ProgressBar.jsx",
            "frontend/src/Components/Status/Status.jsx",
            "frontend/src/Components/Status/StatusUserCard.jsx",
            "frontend/src/Components/Status/StatusViewer.jsx"
        ],
        "message": "feat(frontend): add status and story view carousel with progress indicators"
    },
    # 22. Frontend Real-time HomePage & Message Delivery
    {
        "files": [
            "frontend/src/Components/MessageCard/MessageCard.jsx",
            "frontend/src/Components/HomePage.css",
            "frontend/src/Components/HomePage.jsx"
        ],
        "message": "feat(frontend): integrate real-time stomp client messaging and full chat layout"
    }
]

def run_cmd(cmd):
    print(f"Running: {' '.join(cmd)}")
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"Error ({res.returncode}): {res.stderr}")
    return res

def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(root_dir)
    print(f"Working in: {root_dir}")

    for idx, item in enumerate(COMMITS, 1):
        files_to_add = []
        for f in item["files"]:
            if os.path.exists(f):
                files_to_add.append(f)
            else:
                print(f"Notice: file not found (skipping): {f}")

        if not files_to_add:
            print(f"Step {idx}: No existing files to add, skipping.")
            continue

        add_cmd = ["git", "add"] + files_to_add
        run_cmd(add_cmd)

        status_res = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
        if not status_res.stdout.strip():
            print(f"Step {idx}: No staged changes, skipping commit.")
            continue

        commit_cmd = ["git", "commit", "-m", item["message"]]
        run_cmd(commit_cmd)
        print(f"[{idx}/{len(COMMITS)}] Committed: {item['message']}\n")

    # Final check if any remaining untracked or modified files exist
    final_status = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
    if final_status.stdout.strip():
        print("Adding any remaining files...")
        run_cmd(["git", "add", "."])
        run_cmd(["git", "commit", "-m", "chore: finalize workspace setup and asset files"])

    print("\n--- Commit History ---")
    log_res = subprocess.run(["git", "log", "--oneline"], capture_output=True, text=True)
    print(log_res.stdout)
    commits_count = len(log_res.stdout.strip().split("\n"))
    print(f"\nTotal commits: {commits_count}")

if __name__ == "__main__":
    main()
