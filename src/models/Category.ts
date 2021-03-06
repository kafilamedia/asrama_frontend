
import BaseEntity from './BaseEntity';
import RulePoint from './RulePoint';
export default class Category extends BaseEntity
{
    name?:string;
    description?:string;

    points:RulePoint[] | undefined;

    static clone = (object:any) : Category => {
        return Object.assign(new Category, object);
    }
}