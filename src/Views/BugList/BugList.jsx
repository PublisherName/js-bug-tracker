import React, { useState, useEffect } from 'react';
import Modal from '../Modal/Modal.jsx';
import BugItem from '../BugItem/BugItem.jsx';
import SearchBar from '../SearchBar/SearchBar.jsx';
import './BugList.css'

function BugList() {
    const [data, setData] = useState(() => {
        const localStorageData = localStorage.getItem('formData');
        return localStorageData ? JSON.parse(localStorageData) : [];
    });

    const [isOpen, setIsOpen] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [currentItem, setCurrentItem] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        localStorage.setItem('formData', JSON.stringify(data));
    }, [data]);

    const toggleModal = (action) => {
        setIsOpen(!isOpen);
        if (action !== 'edit') {
            setEditIndex(null);
            setCurrentItem(null);
          }
    };

    const onAddSuccess = (arg) => {
        setData(editIndex !== null ? [...data.slice(0, editIndex), arg, ...data.slice(editIndex + 1)] : [...data, arg]);
        setEditIndex(null);
        setCurrentItem(null);
        setIsOpen(false);
    }

    const modifyItem = (id, action) => {
        const index = data.findIndex(item => item.id === id);
        if (index !== -1) {
            if (action === 'delete') {
                setData([...data.slice(0, index), ...data.slice(index + 1)]);
                localStorage.removeItem(`comments-${id}`);
            } else if (action === 'edit') {
                setEditIndex(index);
                setCurrentItem(data[index]);
                toggleModal('edit');
            }
        }
    };

    const handleFilterChange = (name, value) => {
        if (name === 'status') {
            setFilterStatus(value);
        } else if (name === 'priority') {
            setFilterPriority(value);
        } else if (name === 'searchText') {
            setSearchText(value);
        }
    };

    const filteredData = data.filter(item => {
        return (filterStatus === 'all' || item.status === filterStatus)
            && (filterPriority === 'all' || item.priority === filterPriority)
            && (item.title.toLowerCase().includes(searchText.toLowerCase()));
    });

    return (
        <>
            <section className='section-buglist'>
                <SearchBar onFilterChange={handleFilterChange} searchText={searchText} />
                <div className="add-bug-btn" onClick={toggleModal}>
                    <i className="fas fa-plus"></i> Add Bug
                </div>
                <Modal isOpen={isOpen} closeModal={toggleModal} submitData={onAddSuccess} currentItem={currentItem} />
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Project</th>
                            <th>Description</th>
                            <th>Priority</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="center-text">No record found.</td>
                            </tr>
                        ) : (
                            filteredData.map((item) => (
                                <BugItem key={item.id} item={item} modifyItem={modifyItem} submitData={onAddSuccess} />
                            ))
                        )}
                    </tbody>
                </table>
            </section>
        </>
    );
}

export default BugList;