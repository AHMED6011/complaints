<template>
  <div class="card h-100">
    <div class="card-body chat-care">
      <ul class="chat" id="chat" ref="chatBox" v-if="complaint">
        <li
          :class="getClass(message.userId)"
          v-for="message in complaint.messages"
          :key="message.id"
        >
          <div class="chat-body clearfix">
            <div class="header clearfix">
              <small class="right text-muted">
                <span class="glyphicon glyphicon-time"></span
                >{{ formatDate(message.messageDate) }}</small
              >
            </div>
            <p>{{ message.message }}</p>
          </div>
        </li>
      </ul>
    </div>
    <div class="card-footer">
      <div class="input-group">
        <input
          id="btn-input"
          type="text"
          class="form-control input-sm"
          placeholder="Type your message here..."
          v-model="msg"
        />
        <span class="input-group-btn">
          <button class="btn btn-primary" id="btn-chat" @click="sendMessages">
            Send
          </button>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
// import { userData } from "@/stores/index";
// import { mapState } from "pinia";
import { useCookies } from "vue3-cookies";

export default {
  props: ["id", "complaint"],
  name: "SendMessages",
  data() {
    return {
      allComplaints: [],
      msg: "",
      cookies: useCookies().cookies,
    };
  },
  methods: {
    async sendMessages() {
      const messages = {
        complaintId: this.complaint.id,
        message: this.msg,
      };
      const response = await axios.post(
        `${this.API}/api/ComplaintMessages`,
        messages,
        {
          headers: {
            Authorization: `Bearer ${this.isAllow}`,
            "Content-Type": "application/json",
          },
        }
      );
      this.complaint.messages.push(response.data);
      this.msg = "";
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const hours = date.getHours();
      const minutes = date.getMinutes();

      const formattedHours = hours < 10 ? `0${hours}` : hours;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

      return `${formattedHours}:${formattedMinutes}`;
    },
    scrollChatToBottom() {
      const chatBox = this.$refs.chatBox;

      if (chatBox) {
        chatBox.scrollTop = chatBox.scrollHeight;
      }
    },
    getClass(userID) {
      return userID == this.complaint.userId
        ? "agent clearfix"
        : "admin clearfix";
    },
  },
};
</script>

<style lang="scss" scoped>
.chat {
  list-style: none;
  margin: 0;
  padding: 0;
}

.chat li {
  padding-bottom: 5px;
  margin-top: 10px;
  width: 80%;
}

.chat li .chat-body p {
  margin: 0;
}

.chat-care {
  overflow-y: scroll;
  height: 350px;
}
.chat-care .chat-img {
  width: 50px;
  height: 50px;
}
.chat-care .img-circle {
  border-radius: 50%;
}
.chat-care .chat-img {
  display: inline-block;
}
.chat-care .chat-body {
  display: inline-block;
  max-width: 80%;
  background-color: #ffc195;
  border-radius: 12.5px;
  padding: 15px;
}
.chat-care .chat-body strong {
  color: #0169da;
}

.chat-care .admin {
  text-align: right;
  float: right;
}
.chat-care .admin p {
  text-align: left;
}
.chat-care .agent {
  text-align: left;
  float: left;
}
.chat-care .left {
  float: left;
}
.chat-care .right {
  float: right;
}

.clearfix {
  clear: both;
}

::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #f5f5f5;
}

::-webkit-scrollbar {
  width: 12px;
  background-color: #f5f5f5;
}

::-webkit-scrollbar-thumb {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #555;
}
</style>
