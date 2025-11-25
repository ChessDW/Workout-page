// Workout Schedule Planner JavaScript

// DOM Elements
const workoutForm = document.getElementById('workout-form');
const workoutsContainer = document.getElementById('workouts-container');
const weeklyOverview = document.getElementById('weekly-overview');
const currentWeekElement = document.getElementById('current-week');
const prevWeekButton = document.getElementById('prev-week');
const nextWeekButton = document.getElementById('next-week');
const notification = document.getElementById('notification');
const applyToAllWeekCheckbox = document.getElementById('apply-to-all-week');
const useTemplateButton = document.getElementById('use-template-btn');
const templateWeekInput = document.getElementById('template-week');
const templateModal = document.getElementById('template-modal');
const closeModal = document.querySelector('.close');
const templateCards = document.querySelectorAll('.template-card');

// Stats elements
const totalWorkoutsElement = document.getElementById('total-workouts');
const weeklyWorkoutsElement = document.getElementById('weekly-workouts');
const avgDurationElement = document.getElementById('avg-duration');

// State
let currentWeek = 1;
let workouts = [];
let selectedTemplate = null;

// Enhanced workout templates with detailed information
const workoutTemplates = {
    beginner: {
        name: "Beginner Full Body",
        level: "Beginner",
        focus: "Full Body",
        description: "Perfect for those new to working out. Focuses on building fundamental strength and proper form.",
        workouts: [
            { 
                name: "Full Body Strength", 
                day: "Monday", 
                duration: 45, 
                intensity: "Medium", 
                focus: "Full Body",
                exercises: "Bodyweight Squats: 3x15\nPush-ups (knees if needed): 3x10\nBent-over Rows: 3x12\nPlank: 3x30s\nGlute Bridges: 3x15",
                notes: "Focus on proper form. Rest 60s between sets."
            },
            { 
                name: "Cardio & Core", 
                day: "Wednesday", 
                duration: 30, 
                intensity: "Medium", 
                focus: "Cardio & Core",
                exercises: "Brisk Walking/Jogging: 20min\nCrunches: 3x15\nLeg raises: 3x12\nRussian twists: 3x20\nBird dog: 3x10 per side",
                notes: "Maintain steady pace. Engage core throughout."
            },
            { 
                name: "Full Body Circuit", 
                day: "Friday", 
                duration: 40, 
                intensity: "Medium", 
                focus: "Full Body",
                exercises: "Lunges: 3x10 per leg\nDumbbell Shoulder Press: 3x12\nLat Pulldowns: 3x12\nBicycle Crunches: 3x20\nSuperman: 3x12",
                notes: "Circuit style - minimal rest between exercises"
            }
        ]
    },
    "push-pull": {
        name: "Push/Pull/Legs",
        level: "Intermediate",
        focus: "Split Routine",
        description: "Classic bodybuilding split that separates pushing and pulling movements for optimal recovery.",
        workouts: [
            { 
                name: "Push Day - Chest/Shoulders/Triceps", 
                day: "Monday", 
                duration: 60, 
                intensity: "High", 
                focus: "Upper Body Push",
                exercises: "Bench Press: 4x8-12\nOverhead Press: 3x10\nIncline Dumbbell Press: 3x12\nLateral Raises: 3x15\nTricep Pushdowns: 3x12\nSkull Crushers: 3x10",
                notes: "Focus on chest contraction. Keep shoulders safe."
            },
            { 
                name: "Pull Day - Back/Biceps", 
                day: "Tuesday", 
                duration: 60, 
                intensity: "High", 
                focus: "Upper Body Pull",
                exercises: "Pull-ups/Lat Pulldowns: 4x8-12\nBarbell Rows: 4x8\nFace Pulls: 3x15\nBicep Curls: 3x12\nHammer Curls: 3x12\nShrugs: 3x15",
                notes: "Squeeze back muscles. Maintain neutral spine."
            },
            { 
                name: "Legs & Core", 
                day: "Wednesday", 
                duration: 65, 
                intensity: "High", 
                focus: "Lower Body & Core",
                exercises: "Barbell Squats: 4x8-12\nRomanian Deadlifts: 3x10\nLeg Press: 3x12\nLeg Curls: 3x15\nCalf Raises: 4x15\nCable Crunches: 3x20",
                notes: "Warm up thoroughly. Brace core during squats."
            },
            { 
                name: "Push Day - Volume", 
                day: "Thursday", 
                duration: 55, 
                intensity: "Medium", 
                focus: "Upper Body Push",
                exercises: "Dumbbell Press: 4x12\nArnold Press: 3x12\nCable Flyes: 3x15\nReverse Flyes: 3x15\nOverhead Tricep: 3x12",
                notes: "Lighter weight, higher reps for muscle growth"
            },
            { 
                name: "Pull Day - Width", 
                day: "Friday", 
                duration: 55, 
                intensity: "Medium", 
                focus: "Upper Body Pull",
                exercises: "Wide-grip Pulldowns: 4x12\nSeated Rows: 3x12\nStraight-arm Pulldowns: 3x15\nPreacher Curls: 3x12\nConcentration Curls: 3x12",
                notes: "Focus on back width and bicep peak"
            },
            { 
                name: "Legs - Hypertrophy", 
                day: "Saturday", 
                duration: 60, 
                intensity: "Medium", 
                focus: "Lower Body",
                exercises: "Front Squats: 3x10\nBulgarian Split Squats: 3x12\nGood Mornings: 3x12\nLeg Extensions: 3x15\nSeated Calf Raises: 4x20",
                notes: "Focus on muscle mind connection and pump"
            }
        ]
    },
    "bro-split": {
        name: "Bro Split",
        level: "Advanced",
        focus: "Muscle Group Split",
        description: "Advanced bodybuilding split focusing on one major muscle group per day for maximum intensity.",
        workouts: [
            { 
                name: "Chest & Triceps", 
                day: "Monday", 
                duration: 75, 
                intensity: "High", 
                focus: "Chest & Triceps",
                exercises: "Flat Barbell Bench: 5x5-8\nIncline Dumbbell: 4x8-12\nDecline Press: 3x10\nCable Crossovers: 3x15\nClose-grip Bench: 4x8\nTricep Dips: 3xmax\nRope Pushdowns: 3x12",
                notes: "Go heavy on compounds, focus on squeeze for isolation"
            },
            { 
                name: "Back & Biceps", 
                day: "Tuesday", 
                duration: 75, 
                intensity: "High", 
                focus: "Back & Biceps",
                exercises: "Deadlifts: 3x3-5\nPull-ups: 4xmax\nT-bar Rows: 4x8\nSeated Cable Rows: 3x12\nBarbell Curls: 4x8\nIncline Dumbbell Curls: 3x12\nCable Curls: 3x15",
                notes: "Focus on back thickness and bicep peak contraction"
            },
            { 
                name: "Legs - Quads Focus", 
                day: "Wednesday", 
                duration: 80, 
                intensity: "High", 
                focus: "Legs",
                exercises: "Squats: 5x5-8\nHack Squats: 4x10\nLeg Press: 3x12\nLunges: 3x10 per leg\nLeg Extensions: 4x15\nCalf Raises: 5x15-20",
                notes: "Go deep on squats, focus on quad sweep"
            },
            { 
                name: "Shoulders & Traps", 
                day: "Thursday", 
                duration: 70, 
                intensity: "High", 
                focus: "Shoulders",
                exercises: "Military Press: 5x5-8\nDumbbell Lateral Raises: 4x12\nFront Raises: 3x15\nReverse Flyes: 3x15\nUpright Rows: 3x12\nShrugs: 4x15-20\nFace Pulls: 3x20",
                notes: "Build 3D delts, focus on lateral head development"
            },
            { 
                name: "Arms & Abs", 
                day: "Friday", 
                duration: 60, 
                intensity: "High", 
                focus: "Arms & Core",
                exercises: "Superset: Barbell Curls + Skull Crushers: 4x10\nSuperset: Hammer Curls + Overhead Ext: 3x12\nSuperset: Preacher Curls + Dips: 3x12\nHanging Leg Raises: 4x15\nCable Crunches: 3x20\nPlank: 3x60s",
                notes: "Superset for maximum pump, focus on contraction"
            }
        ]
    },
    strength: {
        name: "Strength Focus",
        level: "Intermediate",
        focus: "Powerlifting",
        description: "Powerlifting-focused routine emphasizing the big three lifts with proper periodization.",
        workouts: [
            { 
                name: "Squat Focus", 
                day: "Monday", 
                duration: 70, 
                intensity: "High", 
                focus: "Lower Body Strength",
                exercises: "Low Bar Squats: 5x5\nPause Squats: 3x3\nLeg Press: 3x8\nWalking Lunges: 3x10 per leg\nLeg Curls: 3x12\nPlank: 3x60s",
                notes: "Focus on depth and explosive concentric"
            },
            { 
                name: "Bench Focus", 
                day: "Wednesday", 
                duration: 65, 
                intensity: "High", 
                focus: "Upper Body Strength",
                exercises: "Bench Press: 5x5\nClose-grip Bench: 3x8\nIncline Dumbbell: 3x10\nTricep Pushdowns: 3x12\nFace Pulls: 3x15\nLat Pulldowns: 3x10",
                notes: "Maintain arch, drive through chest"
            },
            { 
                name: "Deadlift Focus", 
                day: "Friday", 
                duration: 70, 
                intensity: "High", 
                focus: "Posterior Chain",
                exercises: "Conventional Deadlifts: 3x3\nDeficit Deadlifts: 3x5\nBarbell Rows: 4x8\nPull-ups: 3xmax\nGood Mornings: 3x10\nHyperextensions: 3x12",
                notes: "Focus on setup and lockout. Don't round lower back"
            },
            { 
                name: "Accessory & Mobility", 
                day: "Saturday", 
                duration: 45, 
                intensity: "Low", 
                focus: "Recovery & Weak Points",
                exercises: "Band Pull-aparts: 3x20\nExternal Rotations: 3x15\nPallof Press: 3x12 per side\nBird Dog: 3x10 per side\nHip Mobility Drills\nFoam Rolling",
                notes: "Active recovery. Address weak points and mobility"
            }
        ]
    },
    hiit: {
        name: "HIIT & Cardio",
        level: "Intermediate",
        focus: "Metabolic Conditioning",
        description: "High-intensity interval training focused on fat loss and cardiovascular improvement.",
        workouts: [
            { 
                name: "Full Body HIIT", 
                day: "Monday", 
                duration: 40, 
                intensity: "High", 
                focus: "Metabolic Conditioning",
                exercises: "Circuit (45s work, 15s rest):\nBurpees\nMountain Climbers\nJump Squats\nPush-ups\nPlank Jacks\nHigh Knees\nRest 2min, repeat 3x",
                notes: "Max effort during work periods"
            },
            { 
                name: "Running Intervals", 
                day: "Tuesday", 
                duration: 35, 
                intensity: "High", 
                focus: "Cardio",
                exercises: "Warm-up: 5min jog\nIntervals: 400m sprint + 400m walk x 6\nCool-down: 5min walk\nStretching: 5min",
                notes: "Push pace on sprints, active recovery on walks"
            },
            { 
                name: "Strength HIIT", 
                day: "Wednesday", 
                duration: 45, 
                intensity: "High", 
                focus: "Strength Endurance",
                exercises: "EMOM (Every Minute On the Minute):\nMin1: 10 Dumbbell Thrusters\nMin2: 12 Bent-over Rows\nMin3: 15 Lunges\nMin4: 20 Sit-ups\nRepeat 5x",
                notes: "Complete reps quickly, use remaining time to rest"
            },
            { 
                name: "Active Recovery", 
                day: "Thursday", 
                duration: 30, 
                intensity: "Low", 
                focus: "Recovery",
                exercises: "Light Jogging: 20min\nDynamic Stretching: 5min\nFoam Rolling: 5min\nDeep Breathing Exercises",
                notes: "Focus on mobility and recovery"
            },
            { 
                name: "Metabolic Conditioning", 
                day: "Friday", 
                duration: 50, 
                intensity: "High", 
                focus: "Endurance",
                exercises: "AMRAP (As Many Rounds As Possible) in 20min:\n10 Kettlebell Swings\n10 Box Jumps\n10 Med Ball Slams\n10 Calorie Row\nRest 5min, then repeat",
                notes: "Maintain consistent pace, don't burn out early"
            }
        ]
    },
    home: {
        name: "Home Workout",
        level: "Beginner",
        focus: "Bodyweight Training",
        description: "Effective workout routine requiring no equipment, perfect for home or travel.",
        workouts: [
            { 
                name: "Bodyweight Strength", 
                day: "Monday", 
                duration: 35, 
                intensity: "Medium", 
                focus: "Full Body",
                exercises: "Circuit (3 rounds):\nPush-ups: 15 reps\nBodyweight Squats: 20 reps\nPlank: 60s\nTricep Dips (chair): 15 reps\nGlute Bridges: 20 reps\nBird Dog: 10 per side",
                notes: "Focus on form over speed"
            },
            { 
                name: "Cardio Circuit", 
                day: "Tuesday", 
                duration: 25, 
                intensity: "Medium", 
                focus: "Cardio",
                exercises: "Tabata (20s work, 10s rest x 8 rounds):\nHigh Knees\nJumping Jacks\nButt Kicks\nMountain Climbers\nRest 2min, repeat with different exercises",
                notes: "Max intensity during work periods"
            },
            { 
                name: "Yoga & Mobility", 
                day: "Wednesday", 
                duration: 40, 
                intensity: "Low", 
                focus: "Flexibility",
                exercises: "Sun Salutations: 5 rounds\nWarrior Poses: 30s each\nDownward Dog: 60s\nPigeon Pose: 45s per side\nChild's Pose: 60s\nDeep Breathing: 5min",
                notes: "Focus on breath and proper alignment"
            },
            { 
                name: "HIIT Bodyweight", 
                day: "Thursday", 
                duration: 30, 
                intensity: "High", 
                focus: "Metabolic",
                exercises: "45s work, 15s rest:\nBurpees\nSquat Jumps\nPlank to Push-up\nLunge Jumps\nRussian Twists\nRest 2min, repeat 3x",
                notes: "Push hard, modify if needed"
            }
        ]
    }
};

// Initialize the app
function init() {
    loadWorkouts();
    renderWorkouts();
    renderWeeklyOverview();
    updateStats();
    
    // Event listeners
    workoutForm.addEventListener('submit', handleWorkoutSubmit);
    prevWeekButton.addEventListener('click', goToPrevWeek);
    nextWeekButton.addEventListener('click', goToNextWeek);
    useTemplateButton.addEventListener('click', showTemplateModal);
    closeModal.addEventListener('click', hideTemplateModal);
    
    // Template selection
    templateCards.forEach(card => {
        card.addEventListener('click', () => selectTemplate(card.dataset.template));
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === templateModal) {
            hideTemplateModal();
        }
    });
}

// Load workouts from localStorage
function loadWorkouts() {
    const storedWorkouts = localStorage.getItem('workoutSchedule');
    if (storedWorkouts) {
        workouts = JSON.parse(storedWorkouts);
        console.log('Workouts loaded from localStorage:', workouts.length, 'workouts found');
    } else {
        console.log('No workouts found in localStorage, starting fresh');
    }
}

// Save workouts to localStorage
function saveWorkouts() {
    localStorage.setItem('workoutSchedule', JSON.stringify(workouts));
    console.log('Workouts saved to localStorage:', workouts.length, 'workouts');
}

// Show template selection modal
function showTemplateModal() {
    const weekNumber = parseInt(templateWeekInput.value);
    if (!weekNumber || weekNumber < 1 || weekNumber > 52) {
        showNotification('Please enter a valid week number (1-52)');
        return;
    }
    templateModal.style.display = 'block';
}

// Hide template modal
function hideTemplateModal() {
    templateModal.style.display = 'none';
    selectedTemplate = null;
}

// Select template
function selectTemplate(templateKey) {
    selectedTemplate = templateKey;
    applyTemplate();
    hideTemplateModal();
}

// Apply selected template
function applyTemplate() {
    const weekNumber = parseInt(templateWeekInput.value);
    const template = workoutTemplates[selectedTemplate];
    
    if (!template) {
        showNotification('Template not found');
        return;
    }
    
    // Clear existing workouts for this week
    workouts = workouts.filter(workout => workout.week !== weekNumber);
    
    // Add template workouts
    template.workouts.forEach(templateWorkout => {
        const workout = {
            id: Date.now() + Math.random(),
            name: templateWorkout.name,
            day: templateWorkout.day,
            week: weekNumber,
            duration: templateWorkout.duration,
            intensity: templateWorkout.intensity,
            focus: templateWorkout.focus,
            exercises: templateWorkout.exercises,
            notes: templateWorkout.notes,
            completed: false,
            template: template.name
        };
        workouts.push(workout);
    });
    
    saveWorkouts();
    
    // If this is the current week, update the view
    if (weekNumber === currentWeek) {
        renderWorkouts();
        renderWeeklyOverview();
        updateStats();
    }
    
    showNotification(`${template.name} template applied to week ${weekNumber}!`);
    templateWeekInput.value = '';
}

// Handle workout form submission
function handleWorkoutSubmit(e) {
    e.preventDefault();
    
    const workoutData = {
        name: document.getElementById('workout-name').value,
        day: document.getElementById('workout-day').value,
        week: parseInt(document.getElementById('workout-week').value),
        duration: parseInt(document.getElementById('workout-duration').value),
        intensity: document.getElementById('workout-intensity').value,
        exercises: document.getElementById('workout-exercises').value,
        notes: document.getElementById('workout-notes').value,
        completed: false
    };
    
    if (applyToAllWeekCheckbox.checked) {
        // Apply to all days of the week
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        days.forEach(day => {
            const workout = {
                ...workoutData,
                id: Date.now() + Math.random(), // Unique ID
                day: day
            };
            workouts.push(workout);
        });
        showNotification('Workout added to all days of the week!');
    } else {
        // Single workout
        const workout = {
            ...workoutData,
            id: Date.now()
        };
        workouts.push(workout);
        showNotification('Workout added successfully!');
    }
    
    saveWorkouts();
    renderWorkouts();
    renderWeeklyOverview();
    updateStats();
    
    // Reset form
    workoutForm.reset();
    applyToAllWeekCheckbox.checked = false;
}

// Render workouts for the current week
function renderWorkouts() {
    const weekWorkouts = workouts.filter(workout => workout.week === currentWeek);
    
    if (weekWorkouts.length === 0) {
        workoutsContainer.innerHTML = `
            <div class="empty-state">
                <i>💪</i>
                <h3>No workouts scheduled for this week</h3>
                <p>Add a workout using the form on the left</p>
            </div>
        `;
        return;
    }
    
    // Sort workouts by day of week
    const dayOrder = {
        'Monday': 1,
        'Tuesday': 2,
        'Wednesday': 3,
        'Thursday': 4,
        'Friday': 5,
        'Saturday': 6,
        'Sunday': 7
    };
    
    weekWorkouts.sort((a, b) => dayOrder[a.day] - dayOrder[b.day]);
    
    workoutsContainer.innerHTML = `
        <ul class="workout-list">
            ${weekWorkouts.map(workout => `
                <li class="workout-item ${workout.completed ? 'completed' : ''}">
                    <h3>${workout.name} - ${workout.day}</h3>
                    <div class="workout-meta">
                        <span class="intensity ${workout.intensity.toLowerCase()}">${workout.intensity} Intensity</span>
                        ${workout.focus ? `<span class="focus">${workout.focus}</span>` : ''}
                        ${workout.template ? `<span class="template">From: ${workout.template}</span>` : ''}
                    </div>
                    <p><strong>Duration:</strong> ${workout.duration} minutes</p>
                    <p><strong>Exercises:</strong></p>
                    <div class="exercises">${workout.exercises.replace(/\n/g, '<br>')}</div>
                    ${workout.notes ? `<p><strong>Notes:</strong> ${workout.notes}</p>` : ''}
                    <div class="workout-actions">
                        <button class="btn ${workout.completed ? 'btn-secondary' : 'btn-primary'}" 
                                onclick="toggleWorkoutCompletion(${workout.id})">
                            ${workout.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                        </button>
                        <button class="btn btn-danger" onclick="deleteWorkout(${workout.id})">Delete</button>
                    </div>
                </li>
            `).join('')}
        </ul>
    `;
}

// Render weekly overview
function renderWeeklyOverview() {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    weeklyOverview.innerHTML = `
        <div class="weekly-grid">
            ${days.map(day => {
                const dayWorkouts = workouts.filter(w => w.day === day && w.week === currentWeek);
                return `
                    <div class="day-card">
                        <h3>${day}</h3>
                        ${dayWorkouts.length > 0 ? 
                            dayWorkouts.map(workout => `
                                <div class="workout-mini ${workout.completed ? 'completed' : ''}">
                                    <strong>${workout.name}</strong>
                                    <div class="mini-meta">
                                        <span>${workout.duration}min • ${workout.intensity}</span>
                                        ${workout.focus ? `<span class="mini-focus">${workout.focus}</span>` : ''}
                                    </div>
                                </div>
                            `).join('') : 
                            '<p class="no-workout">No workout</p>'
                        }
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// Update statistics
function updateStats() {
    const totalWorkouts = workouts.length;
    const weekWorkouts = workouts.filter(w => w.week === currentWeek).length;
    
    let totalDuration = 0;
    workouts.forEach(workout => {
        totalDuration += workout.duration;
    });
    const avgDuration = totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;
    
    totalWorkoutsElement.textContent = totalWorkouts;
    weeklyWorkoutsElement.textContent = weekWorkouts;
    avgDurationElement.textContent = avgDuration;
}

// Toggle workout completion status
function toggleWorkoutCompletion(id) {
    const workout = workouts.find(w => w.id === id);
    if (workout) {
        workout.completed = !workout.completed;
        saveWorkouts();
        renderWorkouts();
        renderWeeklyOverview();
        updateStats();
    }
}

// Delete a workout
function deleteWorkout(id) {
    if (confirm('Are you sure you want to delete this workout?')) {
        workouts = workouts.filter(w => w.id !== id);
        saveWorkouts();
        renderWorkouts();
        renderWeeklyOverview();
        updateStats();
        showNotification('Workout deleted successfully!');
    }
}

// Navigate to previous week
function goToPrevWeek() {
    if (currentWeek > 1) {
        currentWeek--;
        currentWeekElement.textContent = currentWeek;
        renderWorkouts();
        renderWeeklyOverview();
        updateStats();
    }
}

// Navigate to next week
function goToNextWeek() {
    currentWeek++;
    currentWeekElement.textContent = currentWeek;
    renderWorkouts();
    renderWeeklyOverview();
    updateStats();
}

// Show notification
function showNotification(message) {
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Add these styles to the existing CSS
const additionalStyles = `
    .workout-meta {
        display: flex;
        gap: 8px;
        margin-bottom: 10px;
        flex-wrap: wrap;
    }
    
    .intensity, .focus, .template {
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 600;
    }
    
    .intensity.high {
        background-color: #f8d7da;
        color: #721c24;
    }
    
    .intensity.medium {
        background-color: #fff3cd;
        color: #856404;
    }
    
    .intensity.low {
        background-color: #d4edda;
        color: #155724;
    }
    
    .focus {
        background-color: #cce7ff;
        color: #004085;
    }
    
    .template {
        background-color: #e2e3e5;
        color: #383d41;
    }
    
    .exercises {
        background-color: white;
        padding: 10px;
        border-radius: 5px;
        margin: 10px 0;
        border-left: 3px solid var(--primary);
    }
    
    .mini-meta {
        font-size: 0.8rem;
        color: var(--gray);
        margin-top: 4px;
    }
    
    .mini-focus {
        display: block;
        font-size: 0.7rem;
        color: var(--primary);
    }
`;

// Add the additional styles to the document
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);