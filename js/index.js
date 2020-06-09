const localStorage = window.localStorage;
const body = document.getElementsByTagName('body')[0];
new Vue({
    el: '#app',

    data:{
        newTask:{
            name: '',
            hours: '',
            minutes: ''
        },
        tasks:[],
        ready:false,
        errors:[],
        editTaskFlag:false,
        indexOfTks2Edit: -1,
        themeClass: 'fa-sun',
    },
    methods: {
        addTask(){
            this.checkInputIsOk();
            if(this.errors.length != 0) return;
            
            this.newTask.minutes= this.newTask.minutes < 10 ? '0'+ this.newTask.minutes: ''+this.newTask.minutes;
            this.newTask.hours= this.newTask.hours < 10 ? '0'+ this.newTask.hours: ''+this.newTask.hours;

            if(this.editTaskFlag){
                this.tasks[this.indexOfTks2Edit] = {
                    name: this.newTask.name,
                    hours: this.newTask.hours,
                    minutes: this.newTask.minutes
                };
                this.indexOfTks2Edit = -1;
                this.editTaskFlag = false;
                let auxTasks = this.tasks;
                this.tasks = [];
                this.tasks = auxTasks;
            }
            else{
                this.tasks.push({
                    name: this.newTask.name,
                    hours: this.newTask.hours,
                    minutes: this.newTask.minutes
                })
            }
            this.saveOnLocalStorage();
            this.newTask.name = '';
            this.newTask.hours = '';
            this.newTask.minutes = '';            
        },
        deleteTask(taskName){
            if(this.tasks === undefined || this.tasks === null || taskName === undefined) return;
            const indx = this.tasks.findIndex(el => el.name === taskName);
            this.tasks.splice(indx, 1);
            this.saveOnLocalStorage();
        },
        editTask(taskName){
            if(this.tasks === undefined || this.tasks === null || taskName === undefined) return;
            const indx = this.tasks.findIndex(el => el.name === taskName);

            const regExp = /0(?=[0-9])/; //0 followed by any number between 0 and 9

            this.newTask = {
                name: this.tasks[indx].name,
                hours: this.tasks[indx].hours,
                minutes:this.tasks[indx].minutes,
            };
            this.newTask.minutes = this.newTask.minutes.replace(regExp, '');
            this.newTask.hours = this.newTask.hours.replace(regExp, '');

            this.indexOfTks2Edit = indx;
            this.editTaskFlag = true;
            this.getTotalTime();

        },
        saveOnLocalStorage(){
            localStorage.setItem('tasks',JSON.stringify(this.tasks));
        },

        checkInputIsOk(){
            this.errors = [];
            if(this.newTask.minutes > 59) this.errors.push('Los minutos no deben ser mayor a 59');
            if(this.newTask.minutes < 0) this.errors.push('Los minutos no deben ser mayor a 59');
            if(this.newTask.hours > 3) this.errors.push('Las horas no deben ser mayor a 3');
            if(this.newTask.minutes < 0) this.errors.push('Los minutos no deben ser mayor a 59');
            if(this.newTask.minutes === 0 && this.newTask.hours === 0) this.errors.push('La tarea debe tener duración');

            if(this.newTask.name === '')
                this.errors.push('Introduce un nombre para la tarea');
            if(this.newTask.hours === '')
                this.errors.push('Introduce un número mayor a 0 y menor a 3 en las horas');  
            if(this.newTask.minutes === '')
                this.errors.push('Introduce un número mayor a 0 y menor a 59 en los minutos');                                     
        },
        toggleTheme(){
            if(this.themeClass === 'fa-sun'){
                body.classList.replace('light','dark');
                this.themeClass = 'fa-moon';
                localStorage.setItem('currentTheme','dark');
                return;
            }
            body.classList.replace('dark','light');
            this.themeClass = 'fa-sun';
            localStorage.setItem('currentTheme','light');

        }

    },
    
    mounted() {
        const contentFromLocalStorage = JSON.parse(localStorage.getItem('tasks'));
        if(contentFromLocalStorage != null) this.tasks = contentFromLocalStorage;
        const currentTheme =(localStorage.getItem('currentTheme'));
        if(currentTheme === 'light') {
            body.classList.replace('dark','light');
            this.themeClass = 'fa-sun';
        }
        else {
            body.classList.replace('light','dark');
            this.themeClass = 'fa-moon';
        
        }
    },

    computed: {
        getTotalTime(){
            if(this.tasks.length < 0) 
                return{
                    totalHours: 0,
                    totalMinutes: 0,                    
                };
            let totalHours= 0;
            let totalMinutes = 0;

            this.tasks.forEach(element => {
                totalHours+=parseInt(element.hours);
                totalMinutes+=parseInt(element.minutes);

                if(totalMinutes > 59){
                    totalHours+= parseInt(totalMinutes/60);
                    totalMinutes%= 60;
                }
            });
            
            return {
                totalHours,
                totalMinutes,
            };
        }
    },
})