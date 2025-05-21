// Level System Constants
const LEVELS = [
  { name: "Space Cadet", xpRequired: 0 },
  { name: "Star Gazer", xpRequired: 100 },
  { name: "Stardust Collector", xpRequired: 300 },
  { name: "Lunar Explorer", xpRequired: 600 },
  { name: "Space Explorer", xpRequired: 1000 },
  { name: "Cosmic Voyager", xpRequired: 1500 },
  { name: "Nebula Navigator", xpRequired: 2100 },
  { name: "Galactic Pioneer", xpRequired: 2800 },
  { name: "Interstellar Traveler", xpRequired: 3600 },
  { name: "Cosmic Master", xpRequired: 4500 },
  { name: "Universe Conqueror", xpRequired: 5500 },
]

const REWARDS = [
  { name: "Stardust Badge", icon: "🌟", level: 2 },
  { name: "Lunar Theme", icon: "🌙", level: 3 },
  { name: "Time Booster", icon: "⏱️", level: 4 },
  { name: "Mystery Box", icon: "🔮", level: 6 },
  { name: "UFO Theme", icon: "🛸", level: 8 },
  { name: "Galaxy Badge", icon: "🌌", level: 10 },
]

// User Data (would normally come from a database)
let userData = {
  xp: 650,
  level: 5,
  completedQuestions: 0,
  unlockedRewards: ["Stardust Badge", "Lunar Theme", "Time Booster"],
}

// DOM Elements
document.addEventListener("DOMContentLoaded", () => {
  // Create animated stars background
  createStars()

  // Set up event listeners
  setupEventListeners()

  // Show demo notifications if on index page
  if (window.location.pathname.endsWith("index.html") || window.location.pathname === "/") {
    // Show XP popup after 2 seconds
    setTimeout(() => {
      showXpReward(50, "Great answer!")
    }, 2000)
  }
})

// Create animated stars background
function createStars() {
  const starsContainer = document.getElementById("stars-animation")
  if (!starsContainer) return

  const starsCount = 100

  for (let i = 0; i < starsCount; i++) {
    const star = document.createElement("div")
    star.classList.add("star")

    // Random position
    const x = Math.random() * 100
    const y = Math.random() * 100

    // Random size
    const size = Math.random() * 3 + 1

    // Random opacity
    const opacity = Math.random() * 0.8 + 0.2

    // Random animation delay
    const delay = Math.random() * 5

    star.style.cssText = `
            position: absolute;
            top: ${y}%;
            left: ${x}%;
            width: ${size}px;
            height: ${size}px;
            background-color: white;
            border-radius: 50%;
            opacity: ${opacity};
            animation: twinkle 5s infinite ${delay}s;
        `

    starsContainer.appendChild(star)
  }

  // Add CSS animation
  const style = document.createElement("style")
  style.textContent = `
        @keyframes twinkle {
            0% { opacity: 0.2; }
            50% { opacity: 1; }
            100% { opacity: 0.2; }
        }
    `
  document.head.appendChild(style)
}

// Set up event listeners
function setupEventListeners() {
  // Close level up notification
  const closeNotificationBtn = document.querySelector(".close-notification")
  if (closeNotificationBtn) {
    closeNotificationBtn.addEventListener("click", () => {
      document.getElementById("level-up-notification").classList.add("hidden")
    })
  }

  // Demo buttons for game.html page
  const answerButtons = document.querySelectorAll(".answer-option")
  if (answerButtons.length > 0) {
    answerButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const isCorrect = this.dataset.correct === "true"

        if (isCorrect) {
          this.classList.add("correct")
          const xpGained = Math.floor(Math.random() * 30) + 20 // Random XP between 20-50
          addXp(xpGained)
          showXpReward(xpGained, "Correct answer!")
        } else {
          this.classList.add("incorrect")
          showXpReward(5, "Nice try!")
          addXp(5)
        }

        // Disable all buttons after answer
        answerButtons.forEach((btn) => {
          btn.disabled = true
        })

        // Show next question button
        setTimeout(() => {
          const nextButton = document.querySelector(".next-question")
          if (nextButton) {
            nextButton.classList.remove("hidden")
          }
        }, 1000)
      })
    })
  }

  // Next question button
  const nextButton = document.querySelector(".next-question")
  if (nextButton) {
    nextButton.addEventListener("click", () => {
      // In a real app, this would load the next question
      // For demo purposes, we'll just reset the current question
      answerButtons.forEach((btn) => {
        btn.disabled = false
        btn.classList.remove("correct", "incorrect")
      })
      nextButton.classList.add("hidden")

      // Increment completed questions
      userData.completedQuestions++
      updateGameStats()
    })
  }
}

// Add XP to user and check for level up
function addXp(amount) {
  const oldLevel = calculateLevel(userData.xp)
  userData.xp += amount
  const newLevel = calculateLevel(userData.xp)

  // Update UI if on profile or game page
  updateLevelUI()

  // Check for level up
  if (newLevel > oldLevel) {
    // Level up!
    userData.level = newLevel

    // Check for new rewards
    const newReward = REWARDS.find((reward) => reward.level === newLevel)

    if (newReward) {
      userData.unlockedRewards.push(newReward.name)
      showLevelUpNotification(newLevel, newReward)
    } else {
      showLevelUpNotification(newLevel)
    }
  }

  // Save user data (in a real app, this would save to a database)
  saveUserData()
}

// Calculate level based on XP
function calculateLevel(xp) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xpRequired) {
      return i
    }
  }
  return 0
}

// Get level title based on level
function getLevelTitle(level) {
  return LEVELS[level].name
}

// Update level UI elements
function updateLevelUI() {
  // Update profile page elements
  const levelElements = document.querySelectorAll(".level-number")
  const levelTitleElements = document.querySelectorAll(".level-title")
  const progressBars = document.querySelectorAll(".progress-bar")
  const progressTexts = document.querySelectorAll(".progress-text")
  const nextLevelNames = document.querySelectorAll(".next-level-name")

  const currentLevel = calculateLevel(userData.xp)
  const currentLevelXp = LEVELS[currentLevel].xpRequired
  const nextLevelXp =
    currentLevel < LEVELS.length - 1 ? LEVELS[currentLevel + 1].xpRequired : LEVELS[currentLevel].xpRequired
  const nextLevelName = currentLevel < LEVELS.length - 1 ? LEVELS[currentLevel + 1].name : "Max Level"

  const xpForNextLevel = nextLevelXp - currentLevelXp
  const xpProgress = userData.xp - currentLevelXp
  const progressPercentage = Math.min(100, Math.floor((xpProgress / xpForNextLevel) * 100))

  levelElements.forEach((el) => {
    if (el) el.textContent = currentLevel.toString()
  })

  levelTitleElements.forEach((el) => {
    if (el) el.textContent = getLevelTitle(currentLevel)
  })

  progressBars.forEach((el) => {
    if (el) el.style.width = `${progressPercentage}%`
  })

  progressTexts.forEach((el) => {
    if (el) el.textContent = `${xpProgress} / ${xpForNextLevel} XP`
  })

  nextLevelNames.forEach((el) => {
    if (el) el.textContent = nextLevelName
  })

  // Update game stats if on game page
  updateGameStats()
}

// Update game stats on game page
function updateGameStats() {
  const xpCounter = document.getElementById("xp-counter")
  const levelCounter = document.getElementById("level-counter")
  const questionsCounter = document.getElementById("questions-counter")

  if (xpCounter) xpCounter.textContent = userData.xp
  if (levelCounter) levelCounter.textContent = userData.level
  if (questionsCounter) questionsCounter.textContent = userData.completedQuestions
}

// Show XP reward popup
function showXpReward(amount, message) {
  const popup = document.getElementById("xp-reward-popup")
  const xpAmount = popup.querySelector(".xp-amount")
  const xpMessage = popup.querySelector(".xp-message")

  xpAmount.textContent = `+${amount} XP`
  xpMessage.textContent = message

  popup.classList.remove("hidden")

  // Hide popup after 3 seconds
  setTimeout(() => {
    popup.classList.add("hidden")
  }, 3000)
}

// Show level up notification
function showLevelUpNotification(level, reward = null) {
  const notification = document.getElementById("level-up-notification")
  const newLevelEl = document.getElementById("new-level")
  const levelTitleEl = document.getElementById("level-title")
  const rewardSection = notification.querySelector(".reward-unlocked")

  newLevelEl.textContent = level
  levelTitleEl.textContent = getLevelTitle(level)

  if (reward) {
    rewardSection.querySelector(".reward-icon").textContent = reward.icon
    rewardSection.querySelector(".reward-name").textContent = reward.name
    rewardSection.classList.remove("hidden")
  } else {
    rewardSection.classList.add("hidden")
  }

  notification.classList.remove("hidden")
}

// Save user data to localStorage (in a real app, this would save to a database)
function saveUserData() {
  localStorage.setItem("quizGameUserData", JSON.stringify(userData))
}

// Load user data from localStorage
function loadUserData() {
  const savedData = localStorage.getItem("quizGameUserData")
  if (savedData) {
    userData = JSON.parse(savedData)
  }
}

// Load user data on page load
loadUserData()
