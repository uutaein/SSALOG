package com.ssalog.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ssalog.dto.Group;
import com.ssalog.repository.GroupRepository;

@Service
public class GroupServiceImpl {

	@Autowired
	GroupRepository groupRepository;
	
	
	public void makeGroup(Group g,String username) {
		System.out.println(g.getGroupname());
		groupRepository.save(g);
	}
}
