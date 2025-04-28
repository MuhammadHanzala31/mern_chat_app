

import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/NoChatSelected";
import Sidebar from "../components/Sidebar";
import { useAuthStore } from "../store/zustand/authStore";
import { useChatStore } from "../store/zustand/chatStore";
function Homepage() {
    const { selectedUser } = useChatStore();
    const {authUser} = useAuthStore()


    console.log(authUser);
    

    return (
      <div className="h-screen bg-base-200">
        <div className="flex items-center justify-center pt-5 px-4">
          <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-7rem)]">
            <div className="flex h-full rounded-lg overflow-hidden">
              <Sidebar />
  
              {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
            </div>
          </div>
        </div>
      </div>
    );
}

export default Homepage
