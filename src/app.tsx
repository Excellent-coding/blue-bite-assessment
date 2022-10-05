import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import Card from './components/card';

export type ImageType = {
    alt: string
    src: string
}

export type WeatherType = {
    lat: string
    lon: string
}

export type ButtonType = {
    text: string
    value: string
    variable: string
    setVariable?: ({variable, value, status} : {variable: string, value: string, status?: boolean} ) => void
    status?: boolean
}

export type ConditionType = { variable: string, value: string, status?: boolean }

type ComponentType = {
    id: number
    type: string
    options: ImageType | WeatherType | ButtonType
}

type FetchType = {
    data: {
        components: ComponentType[]
        lists: { id: string, components: number[] }[]
    }
    error? : string
}


const App = () => {
    const { id } = useParams<{ id: string }>();
    const [components, setComponents] = useState<ComponentType[]>([])
    const [condition, setCondition] = useState<ConditionType[]>()
    const [err, setErr] = useState('')
    
    const handleVariable = ({variable, value, status = true} : {variable: string, value: string, status?: boolean}) => {
        const currentCondition = condition || []
        let index = currentCondition.findIndex(({ variable: v }) => v === variable)
        if (variable === 'location') {
            index = currentCondition.findIndex(({ variable: val, value: loc }) => val === variable && loc === value)
            if (index === -1) {
                setCondition([...currentCondition, { variable, value, status: true }])
            } else {
                currentCondition[index] = { variable, value, status: !status }
                setCondition([...currentCondition])
            }
        } else {
            if (index === -1) {
                setCondition([...currentCondition, { variable, value }])
            } else {
                currentCondition[index] = { variable, value }
                setCondition([...currentCondition])
            }
        }
    }
    const handleConditions = (components: ComponentType[]) => {
        const conditions = components.filter(({type}) => type === 'condition').map(({ options }) => options as ConditionType)
        if (conditions.length) {
            let currentConditions: ConditionType[] = []
            conditions.forEach(condition => {
                if (!currentConditions.find(({ variable, value }) => variable === condition.variable && value === condition.value))
                    currentConditions.push({...condition, status: condition.variable === 'location' ? true : false})
            })
            setCondition(currentConditions)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const res: FetchType = await fetch(`http://localhost:3030/page/${id}`).then(res => res.json())
            if (res.error) {
                setErr(res.error)
                return
            }
            handleConditions(res.data.components)
            setComponents(res.data.components.filter(({ type }) => type !== 'condition'))
        }
        fetchData()

    }, [id])

    return (
        <div>
            <Link to='/'>Back</Link>
            {components.map(({id, type, options}) => (
                <Card key={id} type={type} options={options} condition={condition} handleVariable={handleVariable} />
            ))}
            <div className='text-danger text-center'>{err}</div>
        </div>
    );
};

export default App;
