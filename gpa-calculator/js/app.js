class UI {
    constructor() {
        this.gradeFeedback = document.querySelector(".grade-feedback");
        this.gradeForm = document.getElementById("grade-form");
        this.courseInput = document.getElementById("course-input");
        this.gradeInput = document.getElementById("grade-input");
        this.gradesList = document.getElementById("grade-list");
        this.macGPA = document.getElementById("mac-gpa");
        this.fourGPA = document.getElementById("four-gpa");
        this.itemList = [];
        this.itemID = 0;
        this.accepted = {"A+": "12", "A": "11", "A-": "10",
                         "B+": "9", "B": "8", "B-": "7",
                         "C+": "6", "C": "5", "C-": "4",
                         "D+": "3", "D": "2", "D-": "1",
                         "F": "0"}
    };

    // input grade method
    inputGrade() {
        const courseName = this.courseInput.value;
        const gradeValue = this.gradeInput.value;
        const accepted = this.accepted;
        const acceptedLetters = Object.keys(accepted); // gets all accepted letter grades
        const acceptedNums = acceptedLetters.map(function(key){
            return accepted[key];
        }); // gets all accepted point grades
        const numStrings = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

        if ((!(numStrings.includes(courseName.charAt(courseName.length - 2))) &&
            !(numStrings.includes(courseName.charAt(courseName.length - 1))))
            || !(numStrings.includes(courseName.charAt(courseName.length - 1)))) {
            this.gradeFeedback.classList.add("showItem");
            this.gradeFeedback.innerHTML = `<p>Not a valid course name.`;
            const self = this;
            setTimeout(function() {
                self.gradeFeedback.classList.remove("showItem");
            }, 2000);
        } else {
            if (!(acceptedLetters.includes(gradeValue)) && !(acceptedNums.includes(gradeValue))) {
                this.gradeFeedback.classList.add("showItem");
                this.gradeFeedback.innerHTML = `<p>Not a valid course grade.`;
                const self = this;
                setTimeout(function() {
                    self.gradeFeedback.classList.remove("showItem");
                }, 2000);
            } else {
                this.courseInput.value = "";
                this.gradeInput.value = "";
                let courseUnits;

                if (numStrings.includes(courseName.charAt(courseName.length - 2)) &&
                    (numStrings.includes(courseName.charAt(courseName.length - 1)))) {
                    courseUnits = parseInt(courseName.slice(-2));
                } else if (numStrings.includes(courseName.charAt(courseName.length - 1))) {
                    courseUnits = parseInt(courseName.slice(-1));
                }
                
                let gradeEntry = {
                    id: this.itemID,
                    course: courseName,
                    units: courseUnits,
                    grade: gradeValue,
                };

                this.itemID++;
                this.itemList.push(gradeEntry);
                this.addGrade(gradeEntry);
                this.gpaShow();
            }
        };
    };

    // method that shows GPA
    gpaShow() {
        const macGPACalc = this.gpaCalc();
        this.macGPA.textContent = macGPACalc;
        const fourGPACalc = this.gpaConvert();
        this.fourGPA.textContent = fourGPACalc;
    };

    // method for calculating McMaster GPA
    gpaCalc() {
        let totalPoints = 0;
        let totalUnits = 0;
        const macPoints = {"A+": 12, "A": 11, "A-": 10,
                           "B+": 9, "B": 8, "B-": 7,
                           "C+": 6, "C": 5, "C-": 4,
                           "D+": 3, "D": 2, "D-": 1,
                           "F": 0};

        if (this.itemList.length > 0) {
            this.itemList.forEach(function(entry) {
                let thisCourseGrade;

                if (Object.keys(macPoints).includes(entry.grade)) {
                    thisCourseGrade = macPoints[entry.grade];
                } else {
                    thisCourseGrade = parseInt(entry.grade);
                }

                totalPoints += (thisCourseGrade * entry.units);
                totalUnits += entry.units;
            })
        }

        const totalGPA = totalPoints / totalUnits;
        return totalGPA.toFixed(1);
    }

    // method for calculating 4.0-scale GPA
    gpaConvert() {
        let totalPoints = 0;
        let totalUnits = 0;
        const points = {"A+": 4, "A": 3.9, "A-": 3.7,
                        "B+": 3.3, "B": 3, "B-": 2.7,
                        "C+": 2.3, "C": 2, "C-": 1.7,
                        "D+": 1.3, "D": 1, "D-": 0.7,
                        "F": 0}

        const convert = {12: 4, 11: 3.9, 10: 3.7,
                         9: 3.3, 8: 3, 7: 2.7,
                         6: 2.3, 5: 2, 4: 1.7,
                         3: 1.3, 2: 1, 1: 0.7,
                         0: 0}
        
        if (this.itemList.length > 0) {
            this.itemList.forEach(function(entry) {
                let thisCourseGrade;

                if (Object.keys(points).includes(entry.grade)) {
                    thisCourseGrade = points[entry.grade];
                } else {
                    thisCourseGrade = parseFloat(convert[entry.grade]);
                }

                totalPoints += (thisCourseGrade * entry.units);
                totalUnits += entry.units;
            })
        }

        const totalGPA = totalPoints / totalUnits;
        return totalGPA.toFixed(2);
    };

    // method that adds grade
    addGrade(gradeEntry) {
        const div = document.createElement("div");
        const macPointsReversed = {"12":"A+", "11":"A", "10":"A-",
                                   "9":"B+", "8":"B", "7":"B-",
                                   "6":"C+", "5":"C", "4":"C-",
                                   "3":"D+", "2":"D", "1":"D-",
                                   "0":"F"};
        let thisCourseGrade;
        
        if (Object.keys(macPointsReversed).includes(gradeEntry.grade)) {
            thisCourseGrade = macPointsReversed[gradeEntry.grade];
        } else {
            thisCourseGrade = gradeEntry.grade;
        }

        div.classList.add("grade");
        div.innerHTML = `
            <div class="grade-item d-flex justify-content-between align-items-baseline">
                <h6 class="expense-title mb-0 text-uppercase list-item">${gradeEntry.course}</h6>
                <h5 class="expense-amount mb-0 list-item">${thisCourseGrade}</h5>

                <div class="grade-icons list-item">
                    <a href="#" class="edit-icon mx-2" data-id="${gradeEntry.id}">
                        <i class="fas fa-edit"></i>
                    </a>
                    <a href="#" class="delete-icon" data-id="${gradeEntry.id}">
                        <i class="fas fa-trash"></i>
                    </a>
                </div>
            </div>
        `;
        this.gradesList.appendChild(div);
    }

    // method for editing grade
    editGrade(element) {
        let id = parseInt(element.dataset.id);
        let parent = element.parentElement.parentElement.parentElement;

        // remove from DOM
        this.gradesList.removeChild(parent);
        let gradeEntry = this.itemList.filter(function(entry) {
            return entry.id === id;
        });

        // show value
        this.courseInput.value = gradeEntry[0].course;
        this.gradeInput.value = gradeEntry[0].grade;

        // temporarily remove from list
        let tempList = this.itemList.filter(function(entry) {
            return entry.id !== id;
        });

        this.itemList = tempList;
        this.gpaShow();
    };

    // method for deleting grade
    deleteGrade(element) {
        let id = parseInt(element.dataset.id);
        let parent = element.parentElement.parentElement.parentElement;

        // remove from DOM
        this.gradesList.removeChild(parent);

        // remove from list
        let tempList = this.itemList.filter(function(entry) {
            return entry.id !== id;
        });

        this.itemList = tempList;
        this.gpaShow();
    };
};

// listening for events
function eventListeners() {
    const gradeForm = document.getElementById("grade-form");
    const gradesList = document.getElementById("grade-list");

    // new instance of UI class
    const ui = new UI();

    // grade form submit
    gradeForm.addEventListener("submit", function(event) {
        event.preventDefault(); // prevents program from automatically submitting every time it is 
                                // loaded
        ui.inputGrade();
    });

    // grades list click
    gradesList.addEventListener("click", function(event) {
        if (event.target.parentElement.classList.contains("edit-icon")) {
            ui.editGrade(event.target.parentElement);
        } else if (event.target.parentElement.classList.contains("delete-icon")) {
            ui.deleteGrade(event.target.parentElement);
        };
    });
};

document.addEventListener("DOMContentLoaded", function() {
    eventListeners();
});