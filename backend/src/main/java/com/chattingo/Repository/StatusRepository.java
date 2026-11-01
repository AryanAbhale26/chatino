package com.chattingo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.chattingo.Model.Status;

@Repository
public interface StatusRepository extends JpaRepository<Status, Integer> {

    List<Status> findByUserIdOrderByCreatedAtDesc(Integer userId);

    List<Status> findAllByOrderByCreatedAtDesc();
}
