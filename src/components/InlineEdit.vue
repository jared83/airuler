<template>
    <div class="inline-edit" @keyup="handleEdit" :style="{display: slotStyle.display}">
        <div @click="edit(true)">
            <slot/>
            <input size="2" tabindex="1" @focus="selectValue" :placeholder="slotText" ref="input" :style="slotStyle" v-if="editing" type="text" :value="slotText" @blur="edit(false)"/>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        type: String,
        blur: Function
    },
    data() {
        return {
            editing: false,
            slotStyle: {}
        }
    },
    computed: {
        slotText: {
            cache: false,
            get(){
                let txt = this.$slots.default[0].elm.innerText
                return txt
            }
        },
    },
    mounted() {
        let slotElem = this.$slots.default[0].elm
        let s = window.getComputedStyle(slotElem)
        this.slotStyle = {
            color: s.color,
            backgroundColor: s.backgroundColor,
            lineHeight: s.lineHeight,
            font: s.font,
            display: 'block',
            position: 'absolute',
            top: '1px',
            left: 0,
            border: s.border,
            outline: s.outline,
            width: s.width,
            height: s.fontSize,
            margin: 0,
            padding: s.padding,
            overflow: 'visible',
            textAlign: s.textAlign,
        }
    },
    updated(){
        let slotElem = this.$slots.default[0].elm
        let s = window.getComputedStyle(slotElem)
        this.slotStyle.width = s.width
    },
    methods: {
        edit(editing){
            this.editing = editing
            let slotElem = this.$slots.default[0].elm
            if(editing){
                slotElem.style.opacity = 0
                this.$nextTick().then(()=>{
                    this.$refs['input'].focus()
                })
            } else {
                slotElem.style.opacity = 1
                let input = this.$refs['input']
                input.blur()
                this.$emit('value-rejected', input.value)
                // this.blur(input.value)
            }
        },
        handleEdit(e){
            let input = this.$refs['input']
            let timeDelimIdx = input.value.indexOf(':')
            switch (e.which) {
                case 37:
                    input.setSelectionRange(0, timeDelimIdx)
                    break
                case 39:
                    input.setSelectionRange(timeDelimIdx+1, input.value.length)
                    break
                // case 9:
                case 13:
                    this.$emit('value-accepted', input.value)
                    input.blur()
                    break;
                case 27:
                    this.$emit('value-rejected', input.value)
                    input.blur()
                    break;
                default:
                    break
            }
        },
        selectValue(e){
            let input = e.target
            let timeDelimIdx = input.value.indexOf(':')
            input.setSelectionRange(0, timeDelimIdx)
        }
    }
}
</script>

<style>
    .inline-edit {
        /* display: inline-block; */
        position: relative;
    }
</style>
