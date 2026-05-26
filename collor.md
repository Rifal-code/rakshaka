:root{
/_ background _/
--primary-bg-color: #f1f1f1;
--secondary-bg-color: #9c27b0;

/_ text _/
--primary-text-color: #212121;
--secondary-text-color: #757575;

/_ button _/
--primary-btn-color: #f1f1f1;
--secondary-btn-color: #9c27b0;
--danger-btn-color: #f44336;
--success-btn-color: #4caf50;
}

@media (prefers-color-scheme: dark){
:root{
/_ background _/
--primary-bg-color: #212121;
--secondary-bg-color: #9c27b0;

    /* text */
    --primary-text-color: #f1f1f1;
    --secondary-text-color: #757575;

    /* button */
    --primary-btn-color: #212121;
    --secondary-btn-color: #9c27b0;
    --danger-btn-color: #f44336;
    --success-btn-color: #4caf50;

}
}

[data-theme="light"]{
/_ background _/
--primary-bg-color: #f1f1f1;
--secondary-bg-color: #9c27b0;

/_ text _/
--primary-text-color: #212121;
--secondary-text-color: #757575;

/_ button _/
--primary-btn-color: #f1f1f1;
--secondary-btn-color: #9c27b0;
--danger-btn-color: #f44336;
--success-btn-color: #4caf50;
}

[data-theme="dark"]{
/_ background _/
--primary-bg-color: #212121;
--secondary-bg-color: #9c27b0;

/_ text _/
--primary-text-color: #f1f1f1;
--secondary-text-color: #757575;

/_ button _/
--primary-btn-color: #212121;
--secondary-btn-color: #9c27b0;
--danger-btn-color: #f44336;
--success-btn-color: #4caf50;
}

body{
background-color: var(--primary-bg-color);
color: var(--primary-text-color);
}

/_ background _/
.bg-secondary{
background-color: var(--secondary-bg-color);
}

.text-primary{
color: var(--primary-text-color);
}

/_ button _/
.btn{
color: var(--primary-btn-color);
background-color: var(--secondary-btn-color);
}

.btn-secondary{
color: var(--primary-btn-color);
background-color: var(--secondary-btn-color);
}

.btn-success{
color: var(--primary-btn-color);
background-color: var(--success-btn-color);
}

.btn-danger{
color: var(--primary-btn-color);
background-color: var(--danger-btn-color);
}

/_ text _/
.text-secondary{
color: var(--secondary-text-color);
}
