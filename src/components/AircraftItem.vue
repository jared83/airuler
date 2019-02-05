<template>
    <div class="aircraft-item" :id="'aircraft-'+aircraft.ident">
        <div class="aircraft-id col">
                <h1>{{ aircraft.ident }}</h1>
                <p>({{ aircraft.type }})</p>
        </div>
    </div>
</template>

<script>
export default {
    props:{
        aircraft: Object
    }
}
</script>

<style>
    .aircraft-item > p {
        margin: 0;
        padding: 0;
        line-height: 0;
    }
    .aircraft-item {
        position: relative;
        display: inline-flex;
        align-items: stretch;
        width: 300px;
        padding: 1rem;
        box-shadow: 0px 0px 8px 1px #81a779;
        background-color: rgb(27, 24, 41);
    }
    .aircraft-id {
        position: relative;
        margin: 20px 0;
    }
    .col {
        position: relative;
        align-self: center;
        text-align: center;
        flex-grow: 1;
    }
    .error-message {
        color: red;
        position: absolute;
        width: 100%;
        line-height: .8;
    }
</style>
