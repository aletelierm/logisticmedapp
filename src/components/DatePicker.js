import React, {useState} from 'react'
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import format from 'date-fns/format'
import { es } from 'date-fns/locale'
import { Input, Label, ContenedorInput } from '../elementos/CrearEquipos';

const formatFecha = (date = new Date()) => {
    console.log('date', date);
    // console.log('new date()', new Date())
    return format(date, `dd 'de' MMMM 'de' yyyy`, { locale: es })
};

const DatePicker = ({ date, setDate }) => {
    const [visible, setVisibe] = useState(false);

    return (
        <ContenedorInput>
            <Label>Fecha Ingreso</Label>
            <Input type='text'
                readOnly
                value={formatFecha(date)} 
                onClick={() => setVisibe(!visible)}/>
            {visible && <DayPicker 
                mode='single'
                selected={date}
                onSelect={setDate}
                locale={es}
            />}
        </ContenedorInput>
    )
}

export default DatePicker;