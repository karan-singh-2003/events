'use client'
import {parseAsString, parseAsStringEnum, useQueryStates} from 'nuqs'

const statusOptions = ['TODO', 'IN_PROGRESS', 'DONE', 'BLOCKED'];
const priorityOptions = ['LOW', 'MEDIUM', 'HIGH'];

export const useTaskfilter = ()=>{
    return useQueryStates({
        projectId:parseAsString,
        assigneId:parseAsString,
        status:parseAsStringEnum(statusOptions),
        search:parseAsString,
        dueDate:parseAsString
    })
}